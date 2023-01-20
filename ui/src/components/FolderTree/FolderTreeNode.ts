import {defineComponent, onMounted, PropType, ref, watch} from 'vue';
import {isScrolledIntoView} from '../../utils/dom';
import {fetchFolderTreeNode, FolderTreeDataNode} from './FolderTreeDataNode';

export default defineComponent({
    name: 'folder-tree-node',
    props: {
        node: {
            type: Object as PropType<FolderTreeDataNode>,
            required: true,
        },
        depth: {
            type: Number,
            default: 0,
        },
        path: String,
        pathArr: {
            type: Array as PropType<string[]>,
            required: true,
        }
    },
    emits: ['select'],
    setup(props, ctx) {
        const dom = ref<HTMLElement>();
        const selected = ref(false);
        watch(() => props.node,
            async function (node) {
                if (!node.children) {
                    node.children = await fetchFolderTreeNode(node);
                }
            },
            {immediate: true}
        );
        watch([() => props.node, () => props.path],
            function () {
                const pathArr = props.pathArr;
                if (pathArr.length <= props.depth) {
                    selected.value = false;
                    return;
                }
                const path = props.node.path;
                const arr = path.length === 1 ? [path] : path.substring(0, path.length - 1).split('/');
                for (let i = 0; i <= props.depth; ++i) {
                    if (arr[i] === pathArr[i]) {
                        continue;
                    }
                    if (arr[i].toLowerCase() === pathArr[i].toLowerCase()) {
                        continue;
                    }
                    selected.value = false;
                    return;
                }
                selected.value = pathArr.length - 1 === props.depth;
                if (selected.value) {
                    if (dom.value) {
                        if (!isScrolledIntoView(dom.value)) {
                            dom.value.scrollIntoView();
                        }
                    }
                } else {
                    props.node.expanded = true;
                }
            },
            {immediate: true}
        );

        onMounted(function () {
            if (selected.value) {
                dom.value?.scrollIntoView();
            }
        });

        function toggleExpanded() {
            props.node.expanded = !props.node.expanded;
            onSelect(props.node.path);
        }

        function onSelect(path: string) {
            ctx.emit('select', path);
        }

        return {
            dom,
            selected,
            toggleExpanded,
            onSelect,
        };
    }
});
