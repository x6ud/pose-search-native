<template>
    <div class="skeleton" ref="container">
        <canvas ref="canvas"></canvas>

        <div class="anchor" style="top: 4px; left: 4px;">
            <a href="https://sketchfab.com/3d-models/skeleton-4de7b96a351a4a35b1b6e5415277ff07"
               target="_blank"
               title="Author of the original model"
               style="display: inline-block; width: 16px; height: 16px; color: #989898;"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path
                        d="M245.83 214.87l-33.22 17.28c-9.43-19.58-25.24-19.93-27.46-19.93c-22.13 0-33.22 14.61-33.22 43.84c0 23.57 9.21 43.84 33.22 43.84c14.47 0 24.65-7.09 30.57-21.26l30.55 15.5c-6.17 11.51-25.69 38.98-65.1 38.98c-22.6 0-73.96-10.32-73.96-77.05c0-58.69 43-77.06 72.63-77.06c30.72-.01 52.7 11.95 65.99 35.86zm143.05 0l-32.78 17.28c-9.5-19.77-25.72-19.93-27.9-19.93c-22.14 0-33.22 14.61-33.22 43.84c0 23.55 9.23 43.84 33.22 43.84c14.45 0 24.65-7.09 30.54-21.26l31 15.5c-2.1 3.75-21.39 38.98-65.09 38.98c-22.69 0-73.96-9.87-73.96-77.05c0-58.67 42.97-77.06 72.63-77.06c30.71-.01 52.58 11.95 65.56 35.86zM247.56 8.05C104.74 8.05 0 123.11 0 256.05c0 138.49 113.6 248 247.56 248c129.93 0 248.44-100.87 248.44-248c0-137.87-106.62-248-248.44-248zm.87 450.81c-112.54 0-203.7-93.04-203.7-202.81c0-105.42 85.43-203.27 203.72-203.27c112.53 0 202.82 89.46 202.82 203.26c-.01 121.69-99.68 202.82-202.84 202.82z"
                        fill="currentColor"
                    />
                </svg>
            </a>
        </div>

        <div class="anchor" style="top: 4px; right: 4px;"
             v-if="!readonly"
        >
            <div style="cursor: pointer; width: 22px; height: 22px; color: #989898;"
                 title="Reset"
                 @click="reset"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <g fill="none">
                        <path
                            d="M27 16c0-6.075-4.925-11-11-11c-2.923 0-5.58 1.14-7.55 3h2.3a1.25 1.25 0 1 1 0 2.5h-4.5C5.56 10.5 5 9.94 5 9.25v-4.5a1.25 1.25 0 1 1 2.5 0v.761A13.444 13.444 0 0 1 16 2.5c7.456 0 13.5 6.044 13.5 13.5S23.456 29.5 16 29.5S2.5 23.456 2.5 16c0-.28.009-.558.025-.833C2.566 14.494 3.146 14 3.82 14c.709 0 1.24.643 1.199 1.35c-.013.215-.019.432-.019.65c0 6.075 4.925 11 11 11s11-4.925 11-11z"
                            fill="currentColor"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script src="./SkeletonModelCanvas.ts"></script>

<style lang="scss">
.skeleton {
    position: relative;
    box-sizing: border-box;
    border: solid 1px #d9d9d9;
    border-radius: 3px;
    background: #f2f2f2;
    overflow: hidden;

    .anchor {
        position: absolute;
        z-index: 2;
    }
}
</style>
