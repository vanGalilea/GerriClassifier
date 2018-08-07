import {Component} from 'react';
import {Provider} from 'mobx-react';
import {initStore} from '../modules/store';

export default class index extends Component {
    static getInitialProps ({ req }) {
        const isServer = !!req;
        const store = initStore(isServer);
        return { lastUpdate: store.lastUpdate, isServer }
    }

    constructor (props) {
        super(props);
        this.store = initStore(props.isServer, props.lastUpdate);
        this.state = {
            result: '',
            probability: ''
        }
    }

    captureWebcam = async ()=> {
        const video = this.videoRef;
        video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
        video.play();
    };

    classifyVideo = async ()=> {
        const video = this.videoRef;
        const  classifier = await ml5.imageClassifier('MobileNet', video);
        this.loop(classifier);
    };

    loop = async (classifier) => {
        const results = await classifier.predict();
        const firstResult = results[0];
        const {className, probability} = firstResult;
        this.setState({
            result: className,
            probability:  (probability * 100).toFixed(2) + '%',
            isLoading: false
        });
        this.loop(classifier);
    };

    componentDidMount() {
        this.captureWebcam();
        this.classifyVideo();
    }

    render() {
        const {result, probability, isLoading} = this.state;

        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h1>Webcam Image classification using MobileNet</h1>
                    <div className="textContainer">
                        <span>The MobileNet model labeled this as - </span>
                        {
                            isLoading ?
                                <span id="loading"> ...wait a minute...</span> :
                                <div>
                                    <span id="result">{" " + result + " "}</span>
                                    <span> with a confidence of </span>
                                    <span id="probability">{" " + probability + '.'}</span>
                                </div>
                        }
                    </div>
                    <video
                        width="640"
                        height="480"
                        ref={(ref)=> this.videoRef = ref}
                        autoPlay>
                    </video>
                    
                    {/*language=SCSS*/}
                    <style jsx>
                        {`
                            .outerWrap {
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                                align-items: center;

                                #result,
                                #probability,
                                #loading {
                                    font-weight: bold;
                                }
                            }

                            .textContainer {
                                display: flex;
                            }
                        `}
                    </style>
                </div>
            </Provider>
        )
    }

}