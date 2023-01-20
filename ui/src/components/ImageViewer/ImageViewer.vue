<template>
    <teleport to="body">
        <div class="image-viewer"
             v-if="visible"
        >
            <div class="img-wrapper"
                 @wheel="onWheel"
            >
                <img :src="src"
                     alt=""
                     :style="imgStyle"
                     @mousedown="onMouseDown"
                >
            </div>

            <div class="btn-close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                        fill="currentColor"></path>
                </svg>
            </div>
        </div>
    </teleport>
</template>

<script src="./ImageViewer.ts"></script>

<style lang="scss" scoped>
.image-viewer {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 10px 10px 30px 10px;
    background: rgba(0, 0, 0, .5);

    .img-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;

        img {
            max-width: 100%;
            max-height: 100%;
            margin: auto;
            box-shadow: 0 0 12px rgba(0, 0, 0, .5);
            user-select: none;
            cursor: grab;
        }
    }

    .btn-close {
        display: flex;
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 2;
        cursor: pointer;
        color: #fff;
        width: 24px;
        height: 24px;
    }
}
</style>
