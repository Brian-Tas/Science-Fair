class Level {
    constructor(inputCount, outputCount) {
        this.biases = new Array(outputCount);
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);

        this.weights = [];
        for(let i = 0; i < outputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
    }
}

class NeuralNetwork {
    constructor(neuronCount /* neurons per level; array */) {
        this.levels = []

        for(let i = 0; i < neuronCount.length - 1; i++) {
            this.levels.push(new Level(neuronCount[i], neuronCount[i]));
        }
    }
}

console.log(new NeuralNetwork([5, 5]));