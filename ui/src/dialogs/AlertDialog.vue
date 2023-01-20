<template>
    <popup-dialog title=""
                  modal
                  closable
                  v-model:visible="visible"
    >
        <div style="white-space: pre-wrap">{{ message }}</div>
        <template #buttons>
            <button class="primary" @click="onOk">OK</button>
        </template>
    </popup-dialog>
</template>

<script src="./ConfirmDialog.ts"></script>
