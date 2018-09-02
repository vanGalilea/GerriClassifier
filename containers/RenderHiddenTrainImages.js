import {Component} from 'react';
import {inject, observer} from "mobx-react/index";

@inject('store') @observer
export default class RenderHiddenTrainImages extends Component {
    componentDidMount() {
        const {store} = this.props;
        const {train} = store;
        train(this.gerriTrainImages, this.pittigTrainImages);
    }

    componentWillMount() {
        this.gerriTrainImages = [];
        this.pittigTrainImages = [];
    }


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

    render() {
        return (
            <div className="trainImages">
                {this.renderTrainImages()}
                {/*language=SCSS*/}
                <style jsx>
                    {`
                        .trainImages {
                            display: none;
                        }
                    `}
                </style>
            </div>
        )
    }
}