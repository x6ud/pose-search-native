<template>
    <popup-dialog :visible="visible"
                  modal
                  title="How to Use"
                  closable
                  @update:visible="$emit('update:visible', $event)"
    >
        <div style="width: 600px; height: auto; max-width: 100%; max-height: 100%; overflow: auto;">
            <ol>
                <li>
                    Click the [Manage Photos] button.
                </li>
                <li>
                    Add the path of the folder where the photos are located to the list.
                </li>
                <li>
                    <p>
                        Click the [Scan Photos] button and wait for the
                        <a class="link" href="https://google.github.io/mediapipe/solutions/pose.html"
                           target="_blank"
                        >
                            AI model
                        </a>
                        to scan the photos.
                    </p>
                    <p>
                        This will create a .pose_search folder under the photo folder to save the pose data, don't delete it!
                    </p>
                    <p>
                        As a limitation of model recognition accuracy,
                    </p>
                    <ul>
                        <li>only up to one person can be identified per photo;</li>
                        <li>may not get a correct result for loose clothing or complex background.</li>
                    </ul>
                </li>
                <li>
                    To close this application, close both this web page and the command line window.
                </li>
                <li>
                    If the 3D model is not displayed, please check if the browser has WebGL enabled.
                </li>
            </ol>
        </div>
    </popup-dialog>
</template>

<script src="./TutorialDialog.ts"></script>

<style lang="scss" scoped>
ol {
    padding-left: 1.5em;

    li {
        margin: 0 0 1em 0;
    }
}
</style>
