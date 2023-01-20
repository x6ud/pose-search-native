<template>
    <div class="multi-select">
        <label class="option"
               v-for="item in items"
               :title="item.label"
        >
            <input type="checkbox"
                   :checked="item.selected"
                   @change="onChange($event, item.label)"
            >
            <span>{{ item.label }}</span>
        </label>
    </div>
</template>

<script src="./MultiSelect.ts"></script>

<style lang="scss" scoped>
.multi-select {
    box-sizing: border-box;
    min-width: 0;
    height: 100%;
    padding: 4px;
    border-radius: 2px;
    border: solid 1px #d9d9d9;
    overflow: auto;
    user-select: none;
    font-size: 12px;
    color: #000;

    .option {
        display: flex;
        align-items: center;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;

        &:hover {
            background-color: #F0F0F0;
        }
    }
}
</style>
