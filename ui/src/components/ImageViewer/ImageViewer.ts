import {computed, defineComponent, ref} from 'vue';
import {addGlobalDragListener} from '../../utils/dom';

const MAX_ZOOM = 14;
const MIN_ZOOM = -10;

export default defineComponent({
    props: {
        visible: Boolean,
        src: String,
        flip: Boolean,
    },
    emits: ['update:visible'],
    setup(props, ctx) {
        const fullLoading = ref(false);
        const zoom = ref(0);
        const dx = ref(0);
        const dy = ref(0);
        const imgStyle = computed(function () {
            const scale = 1.1 ** zoom.value;
            const translateX = -dx.value / scale * (props.flip ? -1 : 1);
            const translateY = dy.value / scale;
            return {
                transform: `scaleX(${(props.flip ? -1 : 1) * scale}) scaleY(${scale}) translateX(${translateX}px) translateY(${translateY}px)`
            };
        });

        function close() {
            resetTransform();
            ctx.emit('update:visible', false);
        }

        function resetTransform() {
            zoom.value = 0;
            dx.value = 0;
            dy.value = 0;
        }

        function onWheel(e: WheelEvent) {
            zoom.value -= Math.round(e.deltaY / 100);
            zoom.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom.value));
        }

        function onMouseDown(e: PointerEvent) {
            if (e.button === 0) {
                e.preventDefault();
                e.stopPropagation();
                const dragStartX = dx.value;
                const dragStartY = dy.value;
                const x0 = e.clientX;
                const y0 = e.clientY;
                addGlobalDragListener(
                    e,
                    function (e) {
                        dx.value = dragStartX - (e.clientX - x0);
                        dy.value = dragStartY + e.clientY - y0;
                    }
                );
            }
        }

        return {
            fullLoading,
            imgStyle,
            close,
            onWheel,
            onMouseDown,
        };
    }
});
