import {computed, defineComponent, PropType} from 'vue';

export default defineComponent({
    props: {
        options: Array as PropType<string[]>,
        value: Array as PropType<string[]>,
    },
    emits: ['update:value'],
    setup(props, ctx) {
        const items = computed(function () {
            if (!props.options) {
                return [];
            }
            const selected = new Set(props.value || []);
            const ret: { label: string, selected: boolean }[] = [];
            for (let option of props.options) {
                ret.push({label: option, selected: selected.has(option)});
            }
            return ret;
        });

        function onChange(e: InputEvent, option: string) {
            if ((e.target as HTMLInputElement).checked) {
                ctx.emit('update:value', [...(props.value || []), option]);
            } else {
                ctx.emit('update:value', (props.value || []).filter(curr => curr !== option));
            }
        }

        return {
            items,
            onChange,
        };
    }
});
