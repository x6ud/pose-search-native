import {defineComponent, inject, ref, watch} from 'vue';
import FolderTree from '../components/FolderTree/FolderTree.vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';
import {ConfirmDialogContext} from './dialogs';

export default defineComponent({
    components: {PopupDialog, FolderTree},
    setup() {
        const visible = ref(false);
        const message = ref('');
        let isOk = false;

        const context = inject<ConfirmDialogContext | null>('context', null);
        if (context) {
            visible.value = context.visible;
            message.value = context.message;
        }

        watch(visible, visible => {
            if (!visible) {
                context?.callback(isOk);
            }
        });

        function onOk() {
            isOk = true;
            visible.value = false;
        }

        function onCancel() {
            visible.value = false;
        }

        return {
            visible,
            message,
            onOk,
            onCancel,
        };
    }
});
