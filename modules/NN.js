import * as tf from '@tensorflow/tfjs';

export default class NN {

    // This is the model
    model = tf.sequential();

    constructor(inputUnits, inputShape, outputUnits = 1, activation = 'sigmoid') {
        // Create the hidden layer, dense is a "full connected layer"
        const hidden = tf.layers.dense({
            units: inputUnits, // number of nodes (was 4)
            inputShape, // input shape (was [2])
            activation
        });

        // Add the layer
        this.model.add(hidden);

        // Creat another layer
        const output = tf.layers.dense({units: outputUnits, activation}); // here the input shape is "inferred from the previous layer"
        this.model.add(output);

        // An optimizer using gradient descent
        const sgdOpt = tf.train.sgd(0.1);

        // I'm done configuring the model so compile it
        this.model.compile({optimizer: sgdOpt, loss: tf.losses.meanSquaredError});
    };

    static train = async (xs, ys) => {
        const config = {shuffle: true, epochs: 10};
        const response = await this.model.fit(xs, ys, config);
        console.log("training completed, loss is: ", response.history.loss[0]);
    };

    predict = (xs) => {
        const outputs = model.predict(xs);
        console.log('predicting complete');
        outputs.print();
        return outputs;
    };
}
