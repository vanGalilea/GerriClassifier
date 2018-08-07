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

    componentDidMount() {
        const image = this.imageRef;

        ml5.imageClassifier('MobileNet')
              .then(classifier => classifier.predict(image))
              .then(results => {
                  const firstResult = results[0];
                  const {className, probability} = firstResult;
                  this.setState({
                      result: className,
                      probability:  (probability*100).toFixed(2) + '%'
                  })
              });
    }

    render() {
        const {result, probability} = this.state;

        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h1>Image classification using MobileNet</h1>
                    <p>
                        The MobileNet model labeled this as
                        <span id="result">{" " + result + " "}</span>
                        with a confidence of
                        <span id="probability">{" " + probability}</span>.
                    </p>
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
                                #probability {
                                    font-weight: bold;
                                }
                            }
                        `}
                    </style>
                </div>
            </Provider>
        )
    }

}