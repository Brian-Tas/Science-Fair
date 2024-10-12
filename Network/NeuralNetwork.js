class Level {
    constructor(inputCount, outputCount) {
        this.biases = new Array(outputCount);
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);

        this.weights = [];
        for(let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.randomize(this);
    }

    static randomize(level) {
        for(let i = 0; i < level.biases.length; i++) {
            level.biases[i] = (Math.random() * 2 - 1)
        }
    }
}

class NeuralNetwork {
    constructor(neuronCount /* neurons per level; array */) {
        this.levels = [];

        this.levels.push(new Level(
            5, //2 sensors, speed, turn speed, bias 1
            7
        ));
        this.levels.push(new Level(
            7, 7
        ));
        this.levels.push(new Level(
            7, 7
        ));
        this.levels.push(new Level(
            7,
            4 //left, right, forward, back
        ))
    }
}

console.table(new NeuralNetwork().levels);