import {computed, defineComponent, onBeforeUnmount, PropType, ref, watch} from 'vue';
import NormalizedLandmarksCanvas from '../components/NormalizedLandmarksCanvas/NormalizedLandmarksCanvas.vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';
import {useDataset} from '../dataset';
import {loadImage} from '../utils/image';
import PhotoPoseLandmarks from '../utils/PhotoPoseLandmarks';
import {BASE_PATH, request} from '../utils/request';
import {showAlertDialog} from './dialogs';

type DetectPoseResults = {
    normalizedLandmarks: { point: [number, number, number], visibility: number }[];
    worldLandmarks: { point: [number, number, number], visibility: number }[];
};

const worker = new Worker('/assets/detect-pose.worker.js', {type: 'classic'});

function detectPose(image: HTMLImageElement) {
    return new Promise<DetectPoseResults>(async function (resolve) {
        worker.onmessage = function (e) {
            resolve(e.data);
        };
        worker.postMessage(await createImageBitmap(image));
    });
}

export default defineComponent({
    components: {PopupDialog, NormalizedLandmarksCanvas},
    props: {
        paths: Array as PropType<string[]>,
        visible: Boolean,
    },
    emits: ['update:visible'],
    setup(props, ctx) {
        const dataset = useDataset();
        const total = ref(0);
        const progress = ref(0);
        const percent = computed(function () {
            return Math.round(progress.value / total.value * 100);
        });
        const progressText = computed(function () {
            return `${progress.value} / ${total.value}`;
        });
        const currFile = ref('');
        const prevImgUrl = ref('');
        const landmarks = ref<{ point: [number, number, number], visibility: number }[]>([]);
        const currImgUrl = ref('');
        const remainingSecs = ref(0);
        const remaining = computed(function () {
            function padZero(val: number) {
                return val < 10 ? '0' + val : val + '';
            }

            let dt = Math.round(remainingSecs.value);
            const secs = dt % 60;
            dt = Math.floor(dt / 60);
            const mins = dt % 60;
            dt = Math.floor(dt / 60);
            const hours = dt;
            return `${padZero(hours)}:${padZero(mins)}:${padZero(secs)}`;
        });
        const stop = ref(false);
        const SAVE_EVERY_N = 10;

        watch(() => props.visible, function (visible) {
            if (!visible || !props.paths?.length) {
                return;
            }
            start();
        });

        function isImage(fileName: string) {
            fileName = fileName.toLowerCase();
            const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
            return ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'apng', 'gif', 'avif', 'webp', 'bmp'].includes(ext);
        }

        let tid: number = 0;

        function startCountdown() {
            if (!tid) {
                tid = setInterval(function () {
                    remainingSecs.value = Math.max(0, remainingSecs.value - 1);
                }, 1000);
            }
        }

        function stopCountdown() {
            if (tid) {
                clearInterval(tid);
                tid = 0;
            }
        }

        onBeforeUnmount(function () {
            stopCountdown();
        });

        async function start() {
            try {
                total.value = 0;
                progress.value = 0;
                remainingSecs.value = 0;
                stop.value = false;
                currFile.value = '';
                currImgUrl.value = '';
                prevImgUrl.value = '';
                landmarks.value = [];
                const jobs: { folder: string, images: string[] }[] = [];
                for (let path of props.paths!) {
                    const res = await request('/fs/files?path=' + path);
                    const json: string[] = await res.json();
                    const folder = dataset.getFolder(path);
                    const existed = new Set(folder.records.map(record => record.filename));
                    const images = json.filter(file => {
                        return isImage(file) && !existed.has(file);
                    });
                    total.value += images.length;
                    jobs.push({folder: path, images});
                }
                if (!total.value) {
                    showAlertDialog('No new photo found.');
                }
                remainingSecs.value = 15 * total.value;
                startCountdown();
                let avgTime = 0;
                for (let job of jobs) {
                    const folder = dataset.getFolder(job.folder);
                    await dataset.loadFolderLandmarks(folder.path);
                    for (let img of job.images) {
                        const path = job.folder + (job.folder.endsWith('/') ? '' : '/') + img;
                        currFile.value = path;
                        const url = BASE_PATH + '/fs/file?path=' + path;
                        currImgUrl.value = url;
                        const startTime = Date.now();
                        const image = await loadImage(url);
                        const result = await detectPose(image);
                        const record = new PhotoPoseLandmarks();
                        record.filename = img;
                        record.width = image.width;
                        record.height = image.height;
                        for (let i = 0, len = result.normalizedLandmarks.length; i < len; ++i) {
                            record.normalized.push(result.normalizedLandmarks[i].point);
                            record.world.push(result.worldLandmarks[i].point);
                            record.visibility.push(result.normalizedLandmarks[i].visibility);
                        }
                        folder.records.push(record);
                        let dt = Date.now() - startTime;
                        avgTime = (avgTime * progress.value + dt) / (progress.value + 1);
                        prevImgUrl.value = url;
                        landmarks.value = result.normalizedLandmarks;
                        progress.value += 1;
                        if (stop.value || total.value === progress.value) {
                            break;
                        }
                        remainingSecs.value = Math.round(avgTime / 1000 * (total.value - progress.value));
                        if (progress.value % SAVE_EVERY_N === 0) {
                            await dataset.saveFolderRecords(job.folder);
                        }
                    }
                    await dataset.saveFolderRecords(job.folder);
                    if (stop.value) {
                        break;
                    }
                }
            } catch (e) {
                console.error(e);
                showAlertDialog('An error occurred: ' + e);
            }
            stopCountdown();
            ctx.emit('update:visible', false);
        }

        return {
            percent,
            progressText,
            currFile,
            prevImgUrl,
            landmarks,
            currImgUrl,
            remaining,
            stop,
        };
    }
});
