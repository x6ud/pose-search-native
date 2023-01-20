import {defineComponent, inject, onMounted, ref, watch} from 'vue';
import FolderTree from '../components/FolderTree/FolderTree.vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';
import {request} from '../utils/request';
import {SelectFolderDialogContext} from './dialogs';

export default defineComponent({
    components: {PopupDialog, FolderTree},
    setup() {
        const input = ref<HTMLInputElement>();
        const visible = ref(false);
        const path = ref('');
        let isOk = false;

        const context = inject<SelectFolderDialogContext | null>('context', null);
        if (context) {
            visible.value = context.visible;
            path.value = context.path || '';
        }

        watch(visible, visible => {
            if (!visible) {
                context?.callback(isOk ? path.value.trim().replaceAll('\\', '/') : '');
            }
        });

        onMounted(async function () {
            path.value = (await (await request('/fs/homedir')).text()).replaceAll('\\', '/');
        });

        function onPost() {
            path.value = input.value!.value;
        }

        function onOk() {
            isOk = true;
            visible.value = false;
        }

        function onCancel() {
            visible.value = false;
        }

        return {
            input,
            visible,
            path,
            onPost,
            onOk,
            onCancel,
        };
    }
});
