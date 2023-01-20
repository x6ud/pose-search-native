<template>
    <popup-dialog title="Select"
                  modal
                  closable
                  v-model:visible="visible"
    >
        <div style="display: flex; flex-direction: column; width: 350px; height: 350px;">
            <input type="text" style="margin-bottom: 8px;"
                   :value="path"
                   @keydown.enter="onPost"
                   @blur="onPost"
                   ref="input"
            >
            <folder-tree style="flex: 1 1; min-height: 0;"
                         v-model:path="path"
            />
        </div>
        <template #buttons>
            <button class="primary" @click="onOk">OK</button>
            <button class="normal" @click="onCancel">Cancel</button>
        </template>
    </popup-dialog>
</template>

<script src="./SelectFolderDialog.ts"></script>
