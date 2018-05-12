import {Component} from 'react';
import brain from 'brain.js';

const net = new brain.NeuralNetwork();

var output = net.run({ r: 1, g: 0.4, b: 0 });

export default class index extends Component {
    componentDidMount() {
        this.prepareData(document)
    }

    prepareData(document) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = document.getElementById('myimg');
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

        console.log(pixelsArr)
    }

    //
    // trainModel(pixelsArr, isGerri) {
    //     net.train([{input: pixelsArr, output: {isGerri}}]);
    // }





    render(){
        return (
            <div id="hiddenPhotos">
                <img id="myimg" src="/static/gerri.jpg" alt=""/>



                <style jsx>
                    {`
                        img {
                            display: none;
                        }

                    `}
                </style>
            </div>
        )
    }
}