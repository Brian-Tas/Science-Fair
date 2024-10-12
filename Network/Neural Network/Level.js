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

console.log(new Level(5, 5));