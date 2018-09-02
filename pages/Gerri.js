import {Component} from 'react';
import {Provider} from 'mobx-react';
import {initStore} from '../modules/store';
import ImageClassifierContainer from "../containers/ImageClassifierContainer";

export default class Gerri extends Component {
    static getInitialProps ({ req }) {
        const isServer = !!req;
        const store = initStore(isServer);
        return { lastUpdate: store.lastUpdate, isServer }
    }

    constructor (props) {
        super(props);
        this.store = initStore(props.isServer, props.lastUpdate);
        this.state = {}
    }

    render() {
        return (
            <Provider store={this.store}>
               <ImageClassifierContainer/>
            </Provider>
        )
    }

}