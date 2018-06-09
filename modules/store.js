import { action, observable, computed } from 'mobx'
import * as tf from '@tensorflow/tfjs';
import NN from "./NN";

let store = null;

class Store {

    @observable trainPhotos = [];

    constructor(isServer, lastUpdate) {
        this.lastUpdate = lastUpdate;
        this.nn = new NN(4, [2]);
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
                const pixel = {
                    r: imgData.data[i]/255,
                    g: imgData.data[i+1]/255,
                    b: imgData.data[i+2]/255
                };

                pixelsArr.push(pixel);
            }

            console.log("picture added to trainPhotos, this photo has ", pixelsArr.length, " pixels");
            this.trainPhotos = [...this.trainPhotos, pixelsArr];
            console.log("length of trainPhotos is:", this.trainPhotos.length)
        });
    }

    train() {
        const xs = tf.tensor2d([
            [0, 0],
            [0.5, 0.5],
            [1, 1]
        ]);

        const ys = tf.tensor2d([
            [1],
            [0.5],
            [0]
        ]);

        this.nn.train(xs, ys);

        //
        // const xs2 = tf.tensor2d([
        //   [0.25, 0.92],
        //   [0.12, 0.3],
        //   [0.4, 0.74],
        //   [0.1, 0.22],
        // ]);
        //
        // let ys2 = this.nn.predict(xs);
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