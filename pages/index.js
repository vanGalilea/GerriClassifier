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
        this.store = initStore(props.isServer, props.lastUpdate)
    }

    componentDidMount() {
        this.store.prepareData(document)
    }

    render() {
        return (
            <Provider store={this.store}>
                <div className="outerWrap">
                    <h2>De Gerri classifier</h2>
                    <div className="photosGrid">
                        <img id="myimg" src="/static/ger1.jpg" alt=""/>
                        <img id="myimg" src="/static/ger2.jpg" alt=""/>
                        <img id="myimg" src="/static/ger3.jpg" alt=""/>
                        <img id="myimg" src="/static/ger4.jpg" alt=""/>
                        <img id="myimg" src="/static/ger5.jpg" alt=""/>
                    </div>


                    {/*language=SCSS*/}
                    <style jsx>
                        {`@import 'index';`}
                    </style>
                </div>
            </Provider>
        )
    }

}