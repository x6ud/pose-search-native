export function isWebGL2Supported() {
    return !!document.createElement('canvas')?.getContext('webgl2');
}
