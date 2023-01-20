export const NUM_OF_LANDMARKS = 33;

export default class PhotoPoseLandmarks {
    filename: string = '';
    width: number = 0;
    height: number = 0;
    normalized: [number, number, number][] = [];
    world: [number, number, number][] = [];
    visibility: number[] = [];
    saved: boolean = false;
}
