import {computed, defineComponent, nextTick, ref, watch} from 'vue';
import {addGlobalDragListener} from '../../../utils/dom';

type Style = { [name: string]: string | number };

export default defineComponent({
    props: {
        modal: Boolean,
        title: String,
        width: String,
        height: String,
        closable: Boolean,
        visible: Boolean,
        x: Number,
        y: Number,
    },
    emits: ['update:visible', 'update:x', 'update:y', 'close'],
    setup(props, ctx) {
        const dialog = ref<HTMLElement>();
        const x = ref(0);
        const y = ref(0);
        const style = computed(function () {
            const style: Style = {};
            style.left = Math.round(x.value) + 'px';
            style.top = Math.round(y.value) + 'px';
            if (props.width) {
                style.width = props.width;
            }
            if (props.height) {
                style.height = props.height;
            }
            return style;
        });
        watch(
            [() => props.x, () => props.y],
            function ([x_, y_]) {
                if (x_ != null && y_ != null) {
                    x.value = x_;
                    y.value = y_;
                }
            },
            {immediate: true}
        );
        watch(
            () => props.visible,
            async function (visible) {
                if (visible && (props.x == null || props.y == null)) {
                    x.value = 0;
                    y.value = 0;
                    await nextTick();
                    if (dialog.value) {
                        const documentRect = document.body.getBoundingClientRect();
                        const rect = dialog.value.getBoundingClientRect();
                        x.value = Math.max((documentRect.width - rect.width) / 2, 0);
                        y.value = Math.max((documentRect.height - rect.height) * 0.3, 0);
                    }
                }
            },
            {
                immediate: true
            }
        );

        function close() {
            ctx.emit('update:visible', false);
            ctx.emit('close');
        }

        function onTitleMouseDown(e: PointerEvent) {
            const xStart = e.clientX;
            const yStart = e.clientY;
            const x0 = x.value;
            const y0 = y.value;
            addGlobalDragListener(
                e,
                (e) => {
                    if (dialog.value) {
                        const dx = e.clientX - xStart;
                        const dy = e.clientY - yStart;
                        const documentRect = document.body.getBoundingClientRect();
                        const rect = dialog.value.getBoundingClientRect();
                        x.value = Math.max(0, Math.min(documentRect.width - rect.width, x0 + dx));
                        y.value = Math.max(0, Math.min(documentRect.height - rect.height, y0 + dy));
                        ctx.emit('update:x', x.value);
                        ctx.emit('update:y', y.value);
                    }
                }
            );
        }

        return {
            dialog,
            style,
            close,
            onTitleMouseDown,
        };
    }
});
