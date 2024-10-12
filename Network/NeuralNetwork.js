class Level {
    constructor(inputCount, outputCount) {
        this.biases = new Array(outputCount);
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount).fill(0);

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
        for(let i = 0; i < level.weights.length; i++) {
            for(let j = 0; j < level.weights[i].length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    static feedForward(level) {
        for(let i = 0; i < level.inputs.length; i++) {
            for(let j = 0; j < level.outputs.length; j++) {
                level.outputs[j] += level.inputs[i] * level.weights[i][j];
            }
        }

        for(let j = 0; j < level.outputs.length; j++) {
            if(level.outputs[j] > level.biases[j]) {
                level.outputs[j] = 1;
            } else {
                level.outputs[j] = 0;
            }
        }

        return level.outputs;
    }
}

class NeuralNetwork {
    constructor(neuronCount /* neurons per level; array */) {
        this.levels = [];

        this.levels.push(new Level(
            5, //2 sensors, speed, turn speed, bias 1
            7
        ));
        this.levels[0].inputs = [2, -4, 5, -1];

        this.levels.push(new Level(
            7, 7
        ));
        this.levels.push(new Level(
            7,
            4 //left, right, forward, back
        ))
    }
}

console.table(Level.feedForward(new NeuralNetwork().levels[0]));