<template>
    <teleport to="body">
        <div class="popup-dialog__mask"
             :class="{modal, visible}"
        >
            <div class="popup-dialog"
                 :style="style"
                 ref="dialog"
            >
                <div class="popup-dialog__title"
                     @pointerdown="onTitleMouseDown"
                >
                    <div class="popup-dialog__title-text">{{ title }}</div>
                    <button class="popup-dialog__btn-close"
                            v-if="closable"
                            @mousedown.stop
                            @click="close"
                    ></button>
                </div>
                <div class="popup-dialog__body">
                    <slot/>
                </div>
                <div class="popup-dialog__buttons"
                     v-if="$slots.buttons"
                >
                    <slot name="buttons"/>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script src="./PopupDialog.ts"></script>

<style lang="scss" scoped>
.popup-dialog__mask {
    position: fixed;
    z-index: 2000;
    display: none;

    &.visible {
        display: block;
    }

    &.modal {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    & > .popup-dialog {
        position: fixed;
        display: flex;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
        background: #fff;
        border: solid 1px #aaa;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        font-size: 14px;
        color: #000;

        & > .popup-dialog__title {
            display: flex;
            align-items: center;
            background: #fff;
            height: 24px;
            padding: 4px 4px 4px 12px;
            touch-action: none;
            user-select: none;

            .popup-dialog__title-text {
                flex: 1 1;
            }

            .popup-dialog__btn-close {
                width: 24px;
                height: 24px;
                line-height: 24px;
                padding: 0;
                margin: 0 0 0 4px;
                border: none;
                background: transparent;
                color: #000;
                outline: none;
                transition: background-color .3s;

                &:before {
                    content: '×';
                    font-size: 20px;
                }

                &:hover {
                    color: #fff;
                    background-color: #E81123;
                }

                &:active {
                    color: #fff;
                    background-color: #F1707A;
                }
            }
        }

        & > .popup-dialog__body {
            padding: 6px 12px;
            box-sizing: border-box;
            overflow: auto;
        }

        & > .popup-dialog__buttons {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 6px 12px 12px 12px;

            &:deep(button) {
                &:not(:last-child) {
                    margin-right: 8px;
                }
            }
        }
    }
}
</style>
