import { action, observable, computed } from 'mobx'

let store = null;

class Store {
    @observable isLoading = true;
    @observable classifier;

    constructor(isServer, lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    train = (gerriTrainImages, pittigTrainImages)=> {
        if (!gerriTrainImages && !pittigTrainImages) return null;
        let features = ml5.featureExtractor('MobileNet', ()=> "modelLoaded");
        const classifier = features.classification();

        pittigTrainImages.map(img=> classifier.addImage(img, 'Kort pittige vrouw'));
        gerriTrainImages.map(img=> classifier.addImage(img, 'Gerri Eickhof'));
        setTimeout(()=> {
            classifier.train((lossValue)=> console.log("train completion", lossValue));
            this.setIsLoading(false);
        }, 5000);

        this.classifier = classifier;
    };

    classifyImage = (image)=> {
        if (!this.classifier) return null;
        return this.classifier.classify(image);
    };

    setIsLoading = (isLoading)=> this.isLoading = isLoading;
}

export const initStore = (isServer, lastUpdate = Date.now())=> {
    if (isServer && typeof window === 'undefined') {
        return new Store(isServer, lastUpdate)
    }

    if (store === null) {
        store = new Store(isServer, lastUpdate)
    }
    return store
};