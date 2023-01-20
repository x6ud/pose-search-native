<template>
    <popup-dialog title="Confirm"
                  modal
                  closable
                  v-model:visible="visible"
    >
        <div style="white-space: pre-wrap">{{ message }}</div>
        <template #buttons>
            <button class="primary" @click="onOk">OK</button>
            <button class="normal" @click="onCancel">Cancel</button>
        </template>
    </popup-dialog>
</template>

<script src="./ConfirmDialog.ts"></script>
