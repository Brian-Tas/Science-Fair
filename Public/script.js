class Level {
    constructor(inputCount, outputCount, activation = 'binary') {
        this.biases = new Array(outputCount);
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount).fill(0);
        this.activation = activation;

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

    static activate(value, type) {
        switch(type) {
            case 'tanh':
                return Math.tanh(value);
            case 'relu':
                return Math.max(-1, Math.min(1, value));
            case 'binary':
                return value > 0 ? 1 : 0;
            default:
                return value;
        }
    }

    static feedForward(level) {
        for(let i = 0; i < level.inputs.length; i++) {
            for(let j = 0; j < level.outputs.length; j++) {
                level.outputs[j] += level.inputs[i] * level.weights[i][j];
            }
        }

        for (let j = 0; j < level.outputs.length; j++) {
            level.outputs[j] += level.biases[j];
            level.outputs[j] = Level.activate(level.outputs[j], level.activation);
        }

        return level.outputs;
    }
}
class NeuralNetwork {
    constructor(neuronCount = [[5, 'tanh'], [7, 'tanh'], [7, 'tanh'], [2, 'tanh']] /* neurons per level; array */) {
        this.levels = [];

        for(let i = 0; i < neuronCount.length - 1; i++) {
            this.levels.push(new Level(neuronCount[i][0], neuronCount[i + 1][0], neuronCount[i][1]));
        }
        this.levels[0].inputs = [1, 1, 0.5, 1, 0.3];
    }

    static feedForward(network) {
        let currentOutputs = network.levels[0].inputs; 

        for (let i = 0; i < network.levels.length; i++) {
            network.levels[i].inputs = currentOutputs; 
            currentOutputs = Level.feedForward(network.levels[i]); 
        }

        return currentOutputs;
    }
}
class Creature {
    constructor(xCoordinate = 0, yCoordinate = 0, eyeCount = 2) {
        this.x = xCoordinate; //x coordinate. number between 0 and 1 that is a ratio of how far across the square it is
        this.y = yCoordinate; //y coordinate. number between 0 and 1 that is a ratio of how far across the square it is
        
        this.xv = 0;
        this.yv = 0;

        this.v = 10; //velocity
        this.r = 0.25; //rotational degree
        this.rv = 0; //rotational speed

        this.sight = new Array(eyeCount).fill(1);

        this.net = new NeuralNetwork([[5, 'tanh'], [7, 'tanh'], [7, 'tanh'], [2, 'tanh']]);
    }

    run(n1 = 1, n2 = this.x, n3 = this.y, n4 = this.sight[0], n5 = this.sight[1], n6 = this.v, n7 = this.r) {
        return NeuralNetwork.feedForward(this.net);
    }
}

let styleGilbert = document.getElementById('one').style;

function draw() {
    styleGilbert.top = `${gilbert.y * 900 + 20}px`;
    styleGilbert.left = `${gilbert.x * 900 + 20}px`;
    styleGilbert.transform = `rotate(${gilbert.r*360}deg)`;
}

function deltaMove(obj) {
    obj.r += obj.rv / 10;
    obj.rv *= 0.99;
    
    const radians = (obj.r * 360) * (Math.PI / 180);
    const deltaX = obj.v * Math.sin(radians);
    const deltaY = obj.v * Math.cos(radians);
    
    obj.vx += deltaX / 10;
    obj.vy += deltaY / 10;
    
    obj.vx *= 0.93;
    obj.vy *= 0.93;
    
    obj.x += obj.vx / 10;
    obj.y += obj.vy / 10;   
}

let gilbert = new Creature();

setInterval(()=>{
    console.log('hi')
    draw();
    deltaMove(gilbert);
}, 200);

console.table(gilbert.run());