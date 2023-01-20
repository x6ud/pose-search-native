import {defineComponent, inject, ref, watch} from 'vue';
import FolderTree from '../components/FolderTree/FolderTree.vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';
import {AlertDialogContext} from './dialogs';

export default defineComponent({
    components: {PopupDialog, FolderTree},
    setup() {
        const visible = ref(false);
        const message = ref('');

        const context = inject<AlertDialogContext | null>('context', null);
        if (context) {
            visible.value = context.visible;
            message.value = context.message;
        }

        watch(visible, visible => {
            if (!visible) {
                context?.callback();
            }
        });

        function onOk() {
            visible.value = false;
        }

        return {
            visible,
            message,
            onOk,
        };
    }
});
