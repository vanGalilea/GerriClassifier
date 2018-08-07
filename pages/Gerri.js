import {Component} from 'react';
import {Provider} from 'mobx-react';
import {initStore} from '../modules/store';

export default class Gerri extends Component {
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
            isLoading: true
        }
    }

    classifyImage = async (image)=> {
        if(!this.classifier) return null;
        const result = await this.classifier.classify(image);
        this.setState({
            result,
            isLoading: false
        })
    };

    train = ()=> {
        if(!this.gerriTrainImages && !this.pittigTrainImages) return null;
        let features = ml5.featureExtractor('MobileNet', ()=> "modelLoaded");
        const classifier = features.classification();

        this.pittigTrainImages.map(img=> classifier.addImage(img, 'Kort pittige vrouw'));
        this.gerriTrainImages.map(img=> classifier.addImage(img, 'Gerri Eickhof'));
        setTimeout(()=> {
                classifier.train((lossValue)=> console.log("train completion", lossValue));
                this.setState({isLoading: false});
            }, 5000);

        this.classifier = classifier;
    };

    renderTrainImages() {
        let images = [];
        for (let i = 1; i <=18; i++) {
            images.push(
                <img
                    width="224px"
                    height="224px"
                    key={i + "gerri"}
                    src={`../static/trainingFotos/Gerri/${i}.jpg`}
                    ref={(ref)=> this.gerriTrainImages.push(ref)}
                />);
        }

        for (let i = 1; i <=18; i++) {
            images.push(
                <img
                    width="224px"
                    height="224px"
                    key={i + "pittig"}
                    src={`../static/trainingFotos/Pittig/${i}.jpg`}
                    ref={(ref)=> this.pittigTrainImages.push(ref)}
                />);
        }
        return images;
    }

    handleClick = (img) => this.classifyImage(img);

    componentDidMount() {
        this.train();
    }

    componentWillMount() {
        this.gerriTrainImages = [];
        this.pittigTrainImages = [];
    }

    render() {
        const {result, isLoading} = this.state;
        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h1>The Gerri/Pittig Image classification using MobileNet</h1>
                    {isLoading ? <h3 id="loading">LOADING...</h3> : null}
                    <div>
                        <span>The MobileNet model labeled this as </span>
                        <span id="result">{" " + result}</span>
                    </div>
                    <img
                        ref={(ref)=> this.guessPhoto1 = ref}
                        src="/static/guess5.jpg"
                        width="224px"
                        height="224px"
                    />
                    <button onClick={()=> this.handleClick(this.guessPhoto1)}>CLICK TO RECOGNIZE</button>
                    <br/>
                    <img
                        ref={(ref)=> this.guessPhoto2 = ref}
                        src="/static/guess3.jpg"
                        width="224px"
                        height="224px"
                    />
                    <button onClick={()=> this.handleClick(this.guessPhoto2)}>CLICK TO RECOGNIZE</button>
                    <div className="trainImages">
                        {this.renderTrainImages()}
                    </div>
                    {/*language=SCSS*/}
                    <style jsx>
                        {`
                            .outerWrap {
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                                align-items: center;

                                #result,
                                #loading {
                                    font-weight: bold;
                                }
                            }

                            .textContainer {
                                display: flex;
                            }

                            .trainImages {
                                display: none;
                            }
                        `}
                    </style>
                </div>
            </Provider>
        )
    }

}