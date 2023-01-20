import SkeletonModel from '../../components/SkeletonModelCanvas/model/SkeletonModel';
import PhotoPoseLandmarks from '../../utils/PhotoPoseLandmarks';
import {featureBuffers} from '../feature/feature-buffers';
import {getNormal, getQuatDistance, getQuatFromRightUp, getQuatMirrorX, isQuatZero, mid} from '../math';
import PoseMatcher, {FeatureBuffers, MatchResult} from './PoseMatcher';

const MAX_ERROR = Math.PI / 180 * 45;

export default class ChestMatcher implements PoseMatcher {

    private rotation: [number, number, number, number] = [0, 0, 0, 0];

    prepare(model: SkeletonModel): void {
        const up = getNormal(
            mid(model.leftThigh.originViewPosition, model.rightThigh.originViewPosition),
            mid(model.leftUpperArm.originViewPosition, model.rightUpperArm.originViewPosition)
        );
        const right = getNormal(model.rightUpperArm.originViewPosition, model.leftUpperArm.originViewPosition);
        this.rotation = getQuatFromRightUp(right, up);
    }

    match(result: MatchResult, photo: PhotoPoseLandmarks, buffers: FeatureBuffers, index: number): void {
        const rotation = featureBuffers.chest.getChestRotation(buffers.chest, index);
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
        result.center = mid(landmarks[11], landmarks[12]);
        result.related = [
            landmarks[11],
            landmarks[12],
            landmarks[13],
            landmarks[14],
            mid(
                landmarks[24],
                landmarks[23],
                landmarks[12],
                landmarks[11]
            )
        ];
    }

}
