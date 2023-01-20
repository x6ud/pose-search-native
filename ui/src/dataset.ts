import {reactive} from 'vue';
import {featureBuffers} from './search/feature/feature-buffers';
import PhotoPoseLandmarks, {NUM_OF_LANDMARKS} from './utils/PhotoPoseLandmarks';
import {request} from './utils/request';

export const DATASET_CHUNK_SIZE = 5000;

export class DatasetFolder {
    path: string = '';
    records: PhotoPoseLandmarks[] = [];
    features: { [name: string]: Float32Array }[] = [];
    recordsLoaded: boolean = false;
    landmarksLoaded: boolean = false;
}

const dataset = reactive({
    folders: [] as DatasetFolder[],
    promise: null as Promise<any> | null,
    async save() {
        await request('/ds/dataset', {
            method: 'post',
            body: JSON.stringify({
                folders: this.folders.map(folder => folder.path)
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    async load() {
        if (this.promise) {
            return this.promise;
        }
        const res = await (this.promise = request('/ds/dataset'));
        const json: { folders?: string[] } = await res.json();
        if (json?.folders) {
            this.folders = json.folders.map(path => {
                const folder = new DatasetFolder();
                folder.path = path;
                return folder;
            });
        }
    },
    getFolder(path: string) {
        if (!path.endsWith('/')) {
            path += '/';
        }
        let folder = this.folders.find(folder => folder.path === path);
        if (!folder) {
            folder = new DatasetFolder();
            folder.path = path;
            this.folders.push(folder);
        }
        return folder;
    },
    async saveFolderRecords(path: string) {
        const folder = this.getFolder(path);
        if (!folder.landmarksLoaded) {
            await this.loadFolderLandmarks(path);
        }
        const len = folder.records.length;
        const formData = new FormData();
        const json = folder.records.map(record => [
            record.filename,
            record.width,
            record.height,
        ]);
        formData.append('files[]', new Blob([JSON.stringify(json)]), 'summary.json');
        for (let chunkIdx = 0, chunks = Math.ceil(len / DATASET_CHUNK_SIZE); chunkIdx < chunks; ++chunkIdx) {
            let saved = true;
            const chunk: PhotoPoseLandmarks[] = [];
            for (let j = 0; j < DATASET_CHUNK_SIZE; ++j) {
                const i = chunkIdx * DATASET_CHUNK_SIZE + j;
                const record = folder.records[i];
                if (!record) {
                    break;
                }
                if (!record.saved) {
                    saved = false;
                }
                chunk.push(record);
            }
            if (saved) {
                continue;
            }
            const landmarks = new Float32Array(chunk.length * NUM_OF_LANDMARKS * 7);
            for (let i = 0, len = chunk.length; i < len; ++i) {
                const record = chunk[i];
                record.saved = true;
                const normalized = record.normalized;
                const world = record.world;
                const visibility = record.visibility;
                for (let j = 0; j < NUM_OF_LANDMARKS; ++j) {
                    const offset = i * NUM_OF_LANDMARKS * 7 + j * 7;
                    landmarks[offset] = normalized[j][0];
                    landmarks[offset + 1] = normalized[j][1];
                    landmarks[offset + 2] = normalized[j][2];
                    landmarks[offset + 3] = world[j][0];
                    landmarks[offset + 4] = world[j][1];
                    landmarks[offset + 5] = world[j][2];
                    landmarks[offset + 6] = visibility[j];
                }
            }
            formData.append('files[]', new Blob([landmarks]), `landmarks_${chunkIdx}.dat`);
            const features = folder.features[chunkIdx] = {} as { [name: string]: Float32Array };
            for (let name in featureBuffers) {
                const featureBuffer = featureBuffers[name as keyof typeof featureBuffers];
                const data = features[name] = featureBuffer.create(chunk);
                formData.append('files[]', new Blob([data]), `${featureBuffer.filename}_${chunkIdx}.dat`);
            }
        }
        return request('/ds/records?path=' + folder.path, {
            method: 'post',
            body: formData,
        });
    },
    async loadFolderRecords(path: string) {
        const folder = this.getFolder(path);
        if (folder.recordsLoaded) {
            return;
        }
        const res = await request(`/ds/records?path=${path}&file=summary.json`);
        if (res.status === 404) {
            folder.records = [];
            folder.recordsLoaded = true;
            return;
        }
        const str = await res.text();
        const json = JSON.parse(str) as [string, number, number][];
        folder.records = [];
        for (let arr of json) {
            const record = new PhotoPoseLandmarks();
            record.filename = arr[0];
            record.width = arr[1];
            record.height = arr[2];
            record.saved = true;
            folder.records.push(record);
        }
        folder.recordsLoaded = true;
    },
    async loadFolderLandmarks(path: string) {
        const folder = this.getFolder(path);
        if (folder.landmarksLoaded) {
            return;
        }
        await this.loadFolderRecords(path);
        const len = folder.records.length;
        for (let chunkIdx = 0, chunks = Math.ceil(len / DATASET_CHUNK_SIZE); chunkIdx < chunks; ++chunkIdx) {
            const chunk: PhotoPoseLandmarks[] = [];
            for (let j = 0; j < DATASET_CHUNK_SIZE; ++j) {
                const i = chunkIdx * DATASET_CHUNK_SIZE + j;
                const record = folder.records[i];
                if (!record) {
                    break;
                }
                chunk.push(record);
            }
            const res = await request(`/ds/records?path=${path}&file=landmarks_${chunkIdx}.dat`);
            const landmarks = new Float32Array(await res.arrayBuffer());
            for (let i = 0, len = chunk.length; i < len; ++i) {
                const record = chunk[i];
                const normalized = record.normalized;
                const world = record.world;
                const visibility = record.visibility;
                for (let j = 0; j < NUM_OF_LANDMARKS; ++j) {
                    const offset = i * NUM_OF_LANDMARKS * 7 + j * 7;
                    normalized[j] = [landmarks[offset], landmarks[offset + 1], landmarks[offset + 2]];
                    world[j] = [landmarks[offset + 3], landmarks[offset + 4], landmarks[offset + 5]];
                    visibility[j] = landmarks[offset + 6];
                }
            }
            const features = folder.features[chunkIdx] = {} as { [name: string]: Float32Array };
            for (let name in featureBuffers) {
                const featureBuffer = featureBuffers[name as keyof typeof featureBuffers];
                const res = await request(`/ds/records?path=${path}&file=${featureBuffer.filename}_${chunkIdx}.dat`);
                features[name] = new Float32Array(await res.arrayBuffer());
            }
        }
        folder.landmarksLoaded = true;
    }
});

export function useDataset() {
    return dataset;
}
