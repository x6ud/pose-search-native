<template>
    <div class="folder-tree">
        <folder-tree-node v-for="node in tree"
                          :key="node.name"
                          :node="node"
                          :path="path"
                          :path-arr="pathArr"
                          @select="onSelect"
        />
    </div>
</template>

<script src="./FolderTree.ts"></script>

<style lang="scss" scoped>
.folder-tree {
    box-sizing: border-box;
    border-radius: 3px;
    border: solid 1px #D9D9D9;
    background: #fff;
    overflow: auto;
    user-select: none;
}
</style>
