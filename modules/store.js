import { action, observable, computed } from 'mobx'
import * as tf from '@tensorflow/tfjs';
import NN from "./NN";

let store = null;

class Store {

    trainPhotos = [];
    guessPhoto;

    constructor(isServer, lastUpdate) {
        this.lastUpdate = lastUpdate;
        this.nn = new NN(1, [3600, 3]);
    }

    prepareData(document) {
        const imgs = Array.from(document.getElementsByTagName('img'));
        imgs.forEach((img)=> {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0 );
            const imgData = context.getImageData(0, 0, img.width, img.height);
            let pixelsArr = [];

            for (let i = 0; i < imgData.data.length; i += 4) {
                const pixel = [
                    imgData.data[i]/255,
                    imgData.data[i+1]/255,
                    imgData.data[i+2]/255
                ];

                pixelsArr.push(pixel);
            }

            img.className.includes('guessPhoto') ? this.guessPhoto = pixelsArr : this.trainPhotos = [...this.trainPhotos, pixelsArr];
            // this.trainPhotos = [...this.trainPhotos, tf.fromPixels(img)];
            console.log("length of trainPhotos is:", this.trainPhotos.length)
        });

        console.log("trainPhotos", this.trainPhotos)
    }

    train() {
        console.log(this.trainPhotos);
        const xs = tf.tensor3d(this.trainPhotos);

        const ys = tf.tensor2d([
            [1],
            [1],
            [1],
            [1],
            [1],
            [0],
            [0],
            [0],
            [0],
            [0]
        ]);

        this.nn.train(xs, ys);
    }

    predict() {
        const xs = tf.tensor3d([this.guessPhoto]);
        let ys = this.nn.predict(xs);
        return ys.dataSync()[0].toFixed(2);
    }
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