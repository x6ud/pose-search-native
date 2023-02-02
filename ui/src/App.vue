<template>
    <div class="wrapper cols">
        <div class="options">
            <div class="cols"
                 style="margin-bottom: 2px;"
            >
                <button class="link"
                        style="font-size: 14px;"
                        @click="showTutorialDialog = true"
                >
                    How to Use?
                </button>
                <div class="fill"></div>
                <button class="link"
                        style="font-size: 14px; margin-right: 4px;"
                        @click="showManagePhotosDialog = true"
                >
                    <span class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14L6 17h12l-3.86-5.14z"
                                fill="currentColor"/>
                        </svg>
                    </span>
                    Manage Photos
                </button>
            </div>
            <div style="margin-bottom: 2px;">Search in Folder(s):</div>
            <multi-select :options="paths"
                          v-model:value="searchPaths"
                          style="height: 76px;"
            />
            <div class="cols"
                 style="margin-top: 8px;"
            >
                <label class="fill"
                       style="margin-right: 4px;"
                >
                    <select v-model="bodyPart"
                            required
                            style="width: 100%;"
                    >
                        <option value="" disabled hidden>Joint / Body Part</option>
                        <option v-for="(matcher, name) in matchers" :value="name">{{ name }}</option>
                    </select>
                </label>
                <button class="primary"
                        :disabled="!searchPaths.length || !bodyPart"
                        @click="onSearch"
                >
                    Search
                </button>
            </div>
            <div style="margin-top: 4px;">
                <div>Wheel: Rotate Camera / Zoom</div>
                <div>Mouse Right: Move Camera</div>
                <div>Shift + Mouse Left: Rotate Joint</div>
            </div>
            <skeleton-model-canvas style="width: 100%; height: 400px; min-height: 400px; margin-top: 4px;"
                                   :model="model"
                                   :highlights="matchers[bodyPart]?.highlights"
            />
            <div style="margin-top: 8px; line-height: 1.5em;">
                <div style="font-weight: bold;">Pose Search Native</div>
                <div>Version: 20230202</div>
                <div>Author: x6udpngx</div>
                <div>
                    <a class="link" href="https://github.com/x6ud/pose-search-native" target="_blank">Source</a>
                </div>
                <div>
                    <span>Support me:&nbsp;</span>
                    <a class="link" href="https://ko-fi.com/x6udpngx" target="_blank">Ko-fi.com/x6udpngx</a>
                </div>
            </div>
        </div>
        <div class="result fill"
             ref="searchResultsContainerDom"
        >
            <image-clip v-for="photo in searchResults"
                        class="item"
                        :src="photo.url"
                        :width="200"
                        :height="200"
                        :img-width="photo.width"
                        :img-height="photo.height"
                        :center="photo.center"
                        :related="photo.related"
                        :flip="photo.flipped"
                        @click="onClickPhoto(photo)"
            />
        </div>
    </div>

    <tutorial-dialog v-model:visible="showTutorialDialog"/>
    <manage-photos-dialog v-model:visible="showManagePhotosDialog"/>
    <image-viewer v-model:visible="showImageViewer"
                  :src="imageUrl"
                  :flip="imageFlip"
    />
</template>

<script src="./App.ts"></script>

<style src="./ui.scss"></style>

<style lang="scss" scoped>
.wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 4px;
    font-size: 12px;
    color: #989898;

    .options {
        width: 320px;
        height: 100%;
        margin-right: 4px;
        overflow: auto;

        label {
            display: inline-flex;
            align-items: center;
            color: #000;

            input {
                margin-top: 0;
                margin-bottom: 0;
            }
        }
    }

    .result {
        box-sizing: border-box;
        height: 100%;
        padding: 4px;
        border-radius: 2px;
        border: solid 1px #d9d9d9;
        overflow: auto;

        .item {
            float: left;
            margin: 0 4px 4px;
        }
    }
}
</style>
