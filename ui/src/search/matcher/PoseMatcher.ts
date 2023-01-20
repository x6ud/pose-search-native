import SkeletonModel from '../../components/SkeletonModelCanvas/model/SkeletonModel';
import PhotoPoseLandmarks from '../../utils/PhotoPoseLandmarks';
import {featureBuffers} from '../feature/feature-buffers';

export type FeatureBuffers = { [key in keyof typeof featureBuffers]: Float32Array };

export type MatchResult = {
    score: number;
    flipped: boolean;
    accepted: boolean;
    center: [number, number, number];
    related: [number, number, number][];
};

export default interface PoseMatcher {

    prepare(model: SkeletonModel): void;

    match(result: MatchResult, photo: PhotoPoseLandmarks, buffers: FeatureBuffers, index: number): void;

}
