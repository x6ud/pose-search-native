<template>
    <popup-dialog :visible="visible"
                  modal
                  title="Scan Photos"
    >
        <div style="width: 720px; height: 480px; max-width: 100%; max-height: 100%;"
             class="wrapper rows"
        >
            <div class="cols"
                 style="margin-bottom: 8px; align-items: center;"
            >
                <div class="progress-bar fill"
                     style="margin-right: 4px;"
                >
                    <div class="bar" :style="{width: `${percent}%`}"></div>
                </div>
                <div style="margin-right: 4px;">{{ progressText }}</div>
                <button class="normal"
                        @click="stop = true"
                        :disabled="stop"
                >
                    {{ stop ? 'Stopping' : 'Stop' }}
                </button>
            </div>
            <div style="margin-bottom: 8px; font-size: 12px;">
                Remaining: {{ remaining }}
            </div>
            <div v-if="currFile"
                 style="margin-bottom: 8px; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; font-size: 12px;"
            >
                Processing: {{ currFile }}
            </div>
            <div class="cols fill">
                <div class="fill img-wrapper"
                     style="margin-right: 8px"
                >
                    <normalized-landmarks-canvas
                        style="width: 100%; height: 100%;"
                        :img-url="prevImgUrl"
                        :landmarks="landmarks"
                    />
                </div>
                <div class="fill img-wrapper">
                    <img :src="currImgUrl" alt="">
                    <div class="processing">
                        <div class="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </popup-dialog>
</template>

<script src="./ScanPhotosDialog.ts"></script>

<style lang="scss" scoped>
.wrapper {
    .progress-bar {
        position: relative;
        height: 24px;
        background: #EFEFEF;
        border: solid 1px #B2B2B2;
        border-radius: 3px;
        overflow: hidden;
        user-select: none;

        .bar {
            position: absolute;
            z-index: 1;
            left: 0;
            top: 0;
            height: 100%;
            background: #0075FF;
        }
    }

    .img-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 8px;
        border: solid 1px #B2B2B2;
        border-radius: 3px;

        img {
            position: relative;
            z-index: 1;
            max-width: 100%;
            max-height: 100%;
        }

        .processing {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;

            .lds-ring {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
                opacity: .75;
            }

            .lds-ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 64px;
                height: 64px;
                margin: 8px;
                border: 8px solid #fff;
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #fff transparent transparent transparent;
            }

            .lds-ring div:nth-child(1) {
                animation-delay: -0.45s;
            }

            .lds-ring div:nth-child(2) {
                animation-delay: -0.3s;
            }

            .lds-ring div:nth-child(3) {
                animation-delay: -0.15s;
            }

            @keyframes lds-ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }
}
</style>
