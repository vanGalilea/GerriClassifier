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
            score : null
        }
    }

    componentDidMount() {
        this.store.prepareData(document);
        this.store.train();
    }

    handleClick() {
        const predictionScore = this.store.predict();
        this.setState({score: predictionScore})
    }

    render() {
        const {score} = this.state;

        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h2>De Gerri classifier</h2>
                    <div className="photosGrid">
                        <img src="/static/ger1.jpg" alt=""/>
                        <img src="/static/ger2.jpg" alt=""/>
                        <img src="/static/ger3.jpg" alt=""/>
                        <img src="/static/ger4.jpg" alt=""/>
                        <img src="/static/ger5.jpg" alt=""/>
                        <img src="/static/per1.jpeg" alt=""/>
                        <img src="/static/per2.jpeg" alt=""/>
                        <img src="/static/per3.jpeg" alt=""/>
                        <img src="/static/per4.jpeg" alt=""/>
                        <img src="/static/per5.jpeg" alt=""/>
                    </div>

                    <h2>Guess!</h2>
                    <img className="guessPhoto" src="/static/guess.jpeg" alt=""/>
                    {!score ? <button onClick={()=> this.handleClick()}>is Gerri ?</button> : <h2>I'm {score* 100}% sure it's Gerri...</h2>}

                    {/*language=SCSS*/}
                    <style jsx>
                        {`

                            .outerWrap {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                width: 960px;
                                margin: 0 auto;
                                text-align: center;
                            }

                            .photosGrid {
                                width: 600px;
                                display: flex;
                                flex-wrap: wrap;
                                justify-content: space-around;
                            }


                            img {
                                width: 60px;
                                height: 60px;
                            }
                        `}
                    </style>
                </div>
            </Provider>
        )
    }

}