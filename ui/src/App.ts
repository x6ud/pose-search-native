import {computed, defineComponent, nextTick, onMounted, ref, watch} from 'vue';
import ImageClip from './components/ImageClip/ImageClip.vue';
import ImageViewer from './components/ImageViewer/ImageViewer.vue';
import MultiSelect from './components/MultiSelect/MultiSelect.vue';
import {BodyPart} from './components/SkeletonModelCanvas/model/BodyPart';
import SkeletonModel from './components/SkeletonModelCanvas/model/SkeletonModel';
import SkeletonModelCanvas from './components/SkeletonModelCanvas/SkeletonModelCanvas.vue';
import {useDataset} from './dataset';
import ManagePhotosDialog from './dialogs/ManagePhotosDialog.vue';
import TutorialDialog from './dialogs/TutorialDialog.vue';
import ChestMatcher from './search/matcher/ChestMatcher';
import CrotchMatcher from './search/matcher/CrotchMatcher';
import ElbowMatcher from './search/matcher/ElbowMatcher';
import FaceMatcher from './search/matcher/FaceMatcher';
import HipMatcher from './search/matcher/HipMatcher';
import KneeMatcher from './search/matcher/KneeMatcher';
import PoseMatcher from './search/matcher/PoseMatcher';
import ShoulderMatcher from './search/matcher/ShoulderMatcher';
import {search, SearchResult} from './search/search';

export default defineComponent({
    components: {
        ImageClip,
        ImageViewer,
        MultiSelect,
        SkeletonModelCanvas,
        ManagePhotosDialog,
        TutorialDialog,
    },
    setup() {
        const dataset = useDataset();
        const paths = computed(function () {
            return dataset.folders.map(folder => folder.path);
        });
        const searchPaths = ref<string[]>([]);
        {
            const json = localStorage.getItem('pose-search-paths');
            if (json) {
                searchPaths.value = JSON.parse(json);
            }
            watch(searchPaths, function () {
                localStorage.setItem('pose-search-paths', JSON.stringify(searchPaths.value));
            });
        }
        const bodyPart = ref('');
        const model = new SkeletonModel();
        const matchers: {
            [name: string]: {
                matcher: PoseMatcher,
                highlights: BodyPart[],
            }
        } = {
            'Face': {
                matcher: new FaceMatcher(),
                highlights: [BodyPart.head]
            },
            'Chest': {
                matcher: new ChestMatcher(),
                highlights: [BodyPart.trunk]
            },
            'Left Shoulder': {
                matcher: new ShoulderMatcher(true),
                highlights: [BodyPart.trunk, BodyPart.leftUpperArm]
            },
            'Right Shoulder': {
                matcher: new ShoulderMatcher(false),
                highlights: [BodyPart.trunk, BodyPart.rightUpperArm]
            },
            'Left Elbow': {
                matcher: new ElbowMatcher(true),
                highlights: [BodyPart.leftUpperArm, BodyPart.leftLowerArm]
            },
            'Right Elbow': {
                matcher: new ElbowMatcher(false),
                highlights: [BodyPart.rightUpperArm, BodyPart.rightLowerArm]
            },
            'Crotch': {
                matcher: new CrotchMatcher(),
                highlights: [BodyPart.trunk]
            },
            'Left Hip': {
                matcher: new HipMatcher(true),
                highlights: [BodyPart.trunk, BodyPart.leftThigh]
            },
            'Right Hip': {
                matcher: new HipMatcher(false),
                highlights: [BodyPart.trunk, BodyPart.rightThigh]
            },
            'Left Knee': {
                matcher: new KneeMatcher(true),
                highlights: [BodyPart.leftThigh, BodyPart.leftCalf]
            },
            'Right Knee': {
                matcher: new KneeMatcher(false),
                highlights: [BodyPart.rightThigh, BodyPart.rightCalf]
            },
        };
        const showManagePhotosDialog = ref(false);
        const showTutorialDialog = ref(false);
        const searchResultsContainerDom = ref<HTMLElement>();
        const searchResults = ref<SearchResult[]>([]);
        const imageUrl = ref('');
        const imageFlip = ref(false);
        const showImageViewer = ref(false);

        async function onSearch() {
            searchResults.value = [];
            searchResultsContainerDom.value!.scrollTop = 0;
            await nextTick();
            const result: SearchResult[] = [];
            const matcher = matchers[bodyPart.value].matcher;
            for (let path of searchPaths.value) {
                result.push(...await search(model, path, matcher));
            }
            result.sort((a, b) => b.score - a.score);
            searchResults.value = result.slice(0, Math.min(50, result.length));
        }

        function onClickPhoto(photo: SearchResult) {
            imageUrl.value = photo.url;
            imageFlip.value = photo.flipped;
            showImageViewer.value = true;
        }

        onMounted(async function () {
            await dataset.load();
        });

        return {
            dataset,
            paths,
            searchPaths,
            bodyPart,
            model,
            matchers,
            showManagePhotosDialog,
            showTutorialDialog,
            searchResultsContainerDom,
            searchResults,
            imageUrl,
            imageFlip,
            showImageViewer,
            onSearch,
            onClickPhoto,
        };
    }
});
