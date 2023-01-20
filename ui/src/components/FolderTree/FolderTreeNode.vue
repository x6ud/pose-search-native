<template>
    <div class="folder-tree-node"
         :class="{selected}"
         @dblclick="toggleExpanded"
         @click="onSelect(node.path)"
         ref="dom"
    >
        <div class="padding" :style="{flex: `0 0 ${depth * 16}px`}"></div>
        <div class="icon expand"
             :class="{expanded: node.expanded}"
             @click="toggleExpanded"
        >
            <template v-if="node.children?.length">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path
                        d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256L34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
                        fill="currentColor"
                    />
                </svg>
            </template>
        </div>
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
                    fill="currentColor"
                />
            </svg>
        </div>
        <div class="name">
            {{ node.name }}
        </div>
    </div>
    <template v-if="node.expanded && node.children?.length">
        <folder-tree-node v-for="child in node.children"
                          :key="child.name"
                          :node="child"
                          :depth="depth + 1"
                          :path="path"
                          :path-arr="pathArr"
                          @select="onSelect"
        />
    </template>
</template>

<script src="./FolderTreeNode.ts"></script>

<style lang="scss" scoped>
.folder-tree-node {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    font-size: 12px;
    padding: 2px 0;

    &.selected {
        background-color: #F0F0F0;
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
        color: #A6A6A6;

        svg {
            max-width: 100%;
            max-height: 100%;
        }
    }

    .expand {
        color: #505050;

        &.expanded {
            transform: rotate(90deg);
        }

        svg {
            max-width: 10px;
            max-height: 10px;
        }
    }

    .name {
        flex: 1 0 content;
        min-width: fit-content;
        white-space: nowrap;
        margin-left: 4px;
    }
}
</style>
