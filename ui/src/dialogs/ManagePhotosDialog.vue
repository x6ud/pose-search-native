<template>
    <popup-dialog :visible="visible"
                  modal
                  title="Manage Photos"
                  closable
                  @update:visible="$emit('update:visible', $event)"
    >
        <div class="rows"
             style="width: 820px; height: 480px; max-width: 100%; max-height: 100%;"
        >
            <div class="cols" style="margin-bottom: 4px;">
                <button class="link"
                        style="font-size: 14px;"
                        @click="onAddFolder"
                >
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><g fill="none"><path
                            d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75z"
                            fill="currentColor"></path></g></svg>
                    </span>
                    Add Folder
                </button>
                <div class="fill"></div>
                <button class="primary"
                        style="font-size: 14px;"
                        @click="onScan"
                        :disabled="!anyChecked"
                >
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path
                            d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H2v18h18v-7l-2-2zm-1.5 5h-11l2.75-3.53l1.96 2.36l2.75-3.54L16.5 18zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42L22.42 12L19.3 8.89zM15.5 9a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"
                            fill="currentColor"></path></svg>
                    </span>
                    Scan Photos
                </button>
            </div>
            <div class="list fill">
                <div class="item cols"
                     v-for="folder in dataset.folders"
                     :key="folder.path"
                >
                    <div class="fill">
                        <label :title="folder.path">
                            <input type="checkbox" v-model="checked[folder.path]">
                            {{ folder.path }}
                        </label>
                    </div>
                    <div>{{ folder.records.length }} Record(s)</div>
                    <div>
                        <button class="link"
                                style="font-size: 14px;"
                                title="Remove folder from list (won't delete files)"
                                @click="onRemoveFolder(folder.path)"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <template #buttons>
            <button class="normal" @click="$emit('update:visible', false)">Close</button>
        </template>
    </popup-dialog>

    <scan-photos-dialog v-model:visible="showScanPhotosDialog"
                        :paths="scanPaths"
    />
</template>

<script src="./ManagePhotosDialog.ts"></script>

<style lang="scss" scoped>
.list {
    border-radius: 3px;
    border: solid 1px #D9D9D9;
    overflow: auto;
    user-select: none;

    .item {
        align-items: center;
        white-space: nowrap;

        & > * {
            padding: 4px;
        }

        label {
            display: inline-flex;
            align-items: center;
            max-width: 100%;
            overflow: hidden;
        }
    }
}
</style>
