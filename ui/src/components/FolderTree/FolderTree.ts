import {computed, defineComponent, onMounted, ref} from 'vue';
import {fetchFolderTreeNode, FolderTreeDataNode} from './FolderTreeDataNode';
import FolderTreeNode from './FolderTreeNode.vue';

export default defineComponent({
    components: {FolderTreeNode},
    props: {
        path: String
    },
    emits: ['update:path'],
    setup(props, ctx) {
        const tree = ref<FolderTreeDataNode[]>([]);
        const pathArr = computed(function () {
            let path = props.path?.trim();
            if (!path) {
                return [];
            }
            path = path.replaceAll('\\', '/');
            if (path.length === 1) {
                return [path];
            }
            if (path.endsWith('/')) {
                path = path.substring(0, path.length - 1);
            }
            return path.split('/');
        });

        onMounted(async function () {
            tree.value = await fetchFolderTreeNode();
        });

        function onSelect(path: string) {
            ctx.emit('update:path', path);
        }

        return {
            tree,
            pathArr,
            onSelect,
        };
    }
});
