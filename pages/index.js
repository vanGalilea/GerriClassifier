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
            probability: '',
            isLoading: true
        }
    }

    classifyImage = async ()=> {
        const image = this.imageRef;
        const classifier = await ml5.imageClassifier('MobileNet');
        const results = await classifier.predict(image);
        const firstResult = results[0];
        const {className, probability} = firstResult;
        this.setState({
            result: className,
            probability:  (probability * 100).toFixed(2) + '%',
            isLoading: false
        })
    };

    componentDidMount() {
        this.classifyImage();
    }

    render() {
        const {result, probability, isLoading} = this.state;

        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h1>Image classification using MobileNet</h1>
                    <div className="textContainer">
                        <span>The MobileNet model labeled this as </span>
                        {
                            isLoading ?
                                <span id="loading"> ...wait a minute...</span> :
                                <div>
                                    <span id="result">{" " + result + " "}</span>
                                    <span>with a confidence of</span>
                                    <span id="probability">{" " + probability + '.'}</span>
                                </div>
                        }
                    </div>
                    <img
                        ref={(ref)=> this.imageRef = ref}
                        src="/static/bird.jpg"
                    />
                    
                    {/*language=SCSS*/}
                    <style jsx>
                        {`
                            .outerWrap {
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                                align-items: center;

                                img {
                                    width: 400px;
                                }

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