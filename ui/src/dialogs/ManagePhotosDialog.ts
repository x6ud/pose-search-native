import {computed, defineComponent, onMounted, reactive, ref} from 'vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';
import {DatasetFolder, useDataset} from '../dataset';
import {showConfirmDialog, showSelectFolderDialog} from './dialogs';
import ScanPhotosDialog from './ScanPhotosDialog.vue';

export default defineComponent({
    components: {PopupDialog, ScanPhotosDialog},
    props: {
        visible: Boolean,
    },
    emits: ['update:visible'],
    setup() {
        const dataset = useDataset();
        const checked = reactive<{ [path: string]: boolean }>({});
        const anyChecked = computed(function () {
            return !!dataset.folders.filter(folder => checked[folder.path]).length;
        });
        const showScanPhotosDialog = ref(false);
        const scanPaths = ref<string[]>([]);

        onMounted(async function () {
            await dataset.load();
            for (let folder of dataset.folders) {
                dataset.loadFolderRecords(folder.path);
            }
        });

        async function onAddFolder() {
            const path = await showSelectFolderDialog();
            if (!path) {
                return;
            }
            if (dataset.folders.find(folder => {
                return folder.path.toLowerCase() === path.toLowerCase();
            })) {
                return;
            }
            const folder = new DatasetFolder();
            folder.path = path;
            dataset.folders.push(folder);
            await dataset.loadFolderRecords(folder.path);
            if (!folder.records.length) {
                folder.recordsLoaded = true;
                folder.landmarksLoaded = true;
            }
            checked[path] = true;
            await dataset.save();
        }

        async function onRemoveFolder(path: string) {
            if (await showConfirmDialog('Are you sure you want to remove the folder from the list (won\'t delete files)?')) {
                dataset.folders = dataset.folders.filter(folder => folder.path !== path);
                delete checked[path];
                await dataset.save();
            }
        }

        function onScan() {
            scanPaths.value = dataset.folders.filter(folder => checked[folder.path]).map(folder => folder.path);
            showScanPhotosDialog.value = !!scanPaths.value.length;
        }

        return {
            dataset,
            checked,
            anyChecked,
            showScanPhotosDialog,
            scanPaths,
            onAddFolder,
            onRemoveFolder,
            onScan,
        };
    }
});
