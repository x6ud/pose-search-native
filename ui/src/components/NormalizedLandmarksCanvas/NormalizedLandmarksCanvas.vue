<template>
    <div class="normalized-landmarks-canvas"
         ref="wrapper"
    >
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script src="./NormalizedLandmarksCanvas.ts"></script>

<style lang="scss">
.normalized-landmarks-canvas {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
}
</style>
