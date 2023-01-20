import SkeletonModel from '../../components/SkeletonModelCanvas/model/SkeletonModel';
import PhotoPoseLandmarks from '../../utils/PhotoPoseLandmarks';
import {featureBuffers} from '../feature/feature-buffers';
import {getNormal, getQuatDistance, getQuatFromRightForward, getQuatMirrorX, isQuatZero, mid} from '../math';
import PoseMatcher, {FeatureBuffers, MatchResult} from './PoseMatcher';

const MAX_ERROR = Math.PI / 180 * 45;

export default class FaceMatcher implements PoseMatcher {

    private rotation: [number, number, number, number] = [0, 0, 0, 0];

    prepare(model: SkeletonModel): void {
        const leftEar = model.head.landmarksViewPosition[0];
        const rightEar = model.head.landmarksViewPosition[1];
        const right = getNormal(rightEar, leftEar);
        const forward = getNormal(model.head.originViewPosition, model.head.controlPointViewPosition);
        this.rotation = getQuatFromRightForward(right, forward);
    }

    match(result: MatchResult, photo: PhotoPoseLandmarks, buffers: FeatureBuffers, index: number): void {
        const rotation = featureBuffers.face.getFaceRotation(buffers.face, index);
        if (isQuatZero(rotation)) {
            return;
        }
        const errorP = getQuatDistance(this.rotation, rotation);
        const errorF = getQuatDistance(this.rotation, getQuatMirrorX(rotation));
        if (errorF > MAX_ERROR && errorP > MAX_ERROR) {
            return;
        }
        const scoreP = Math.PI - errorP;
        const scoreF = Math.PI - errorF;
        result.accepted = true;
        if (scoreP > scoreF) {
            result.score = scoreP;
        } else {
            result.score = scoreF;
            result.flipped = true;
        }

        const landmarks = photo.normalized;
        const xl = Math.min(landmarks[8][0], landmarks[7][0]);
        const xh = Math.max(landmarks[8][0], landmarks[7][0]);
        const xRange = xh - xl;
        const xPadding = xRange * 0.5;
        const yl = Math.min(landmarks[6][1], landmarks[3][1], landmarks[10][1], landmarks[9][1]);
        const yh = Math.min(landmarks[6][1], landmarks[3][1], landmarks[10][1], landmarks[9][1]);
        const yRange = yh - yl;
        const yPadding = yRange * 0.5;
        result.center = mid(landmarks[0]);
        result.related = [
            landmarks[8],
            landmarks[7],
            landmarks[10],
            landmarks[9],
            [xl - xPadding, landmarks[0][1], landmarks[0][2]],
            [xh + xPadding, landmarks[0][1], landmarks[0][2]],
            [landmarks[0][0], yl - yPadding, landmarks[0][2]],
            [landmarks[0][0], yh + yPadding, landmarks[0][2]],
        ];
    }

}
