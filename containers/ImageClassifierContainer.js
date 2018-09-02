import {Component} from 'react';
import {inject, observer} from "mobx-react/index";
import RenderHiddenTrainImages from "./RenderHiddenTrainImages";

@inject('store') @observer
export default class ImageClassifierContainer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            result: ''
        };
    }

    handleClick = async (img) => {
        const {store} = this.props;
        const result = await store.classifyImage(img);
        this.setState({result})
    };

    render() {
        const {result} = this.state;
        const {store} = this.props;
        const {isLoading} = store;
        return (
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
                <RenderHiddenTrainImages/>
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
                    `}
                </style>
            </div>
        )
    }

}