import SkeletonModel from '../components/SkeletonModelCanvas/model/SkeletonModel';
import {DATASET_CHUNK_SIZE, useDataset} from '../dataset';
import PhotoPoseLandmarks from '../utils/PhotoPoseLandmarks';
import {BASE_PATH} from '../utils/request';
import PoseMatcher, {FeatureBuffers, MatchResult} from './matcher/PoseMatcher';

export type SearchResult = {
    url: string;
    width: number;
    height: number;
    score: number;
    flipped: boolean;
    center: [number, number, number];
    related: [number, number, number][];
};

const dataset = useDataset();

export async function search(
    model: SkeletonModel,
    path: string,
    matcher: PoseMatcher,
) {
    matcher.prepare(model);
    const matchResult: MatchResult = {score: 0, flipped: false, accepted: false, center: [0, 0, 0], related: []};
    const ret: SearchResult[] = [];
    await dataset.loadFolderLandmarks(path);
    const folder = dataset.getFolder(path);
    if (!folder.path.endsWith('/')) {
        folder.path += '/';
    }
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
        const buffers = folder.features[chunkIdx];
        for (let i = 0, len = chunk.length; i < len; ++i) {
            matchResult.score = 0;
            matchResult.accepted = false;
            matchResult.flipped = false;
            const photo = chunk[i];
            matcher.match(matchResult, photo, buffers as FeatureBuffers, i);
            if (matchResult.accepted) {
                ret.push({
                    url: BASE_PATH + '/fs/file?path=' + folder.path + photo.filename,
                    width: photo.width,
                    height: photo.height,
                    score: matchResult.score,
                    flipped: matchResult.flipped,
                    center: matchResult.center,
                    related: matchResult.related,
                });
            }
        }
    }
    return ret;
}
