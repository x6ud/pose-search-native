import {defineComponent} from 'vue';
import PopupDialog from '../components/popup/PopupDialog/PopupDialog.vue';

export default defineComponent({
    components: {PopupDialog},
    props: {
        visible: Boolean,
    },
    emits: ['update:visible'],
    setup() {

    }
});
