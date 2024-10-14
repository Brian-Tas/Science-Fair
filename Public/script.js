const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Level {
    constructor(inputCount, outputCount, activation = 'binary') {
        this.biases = new Array(outputCount).fill(0);
        this.inputs = new Array(inputCount).fill(0);
        this.outputs = new Array(outputCount).fill(0);
        this.activation = activation;

        this.weights = [];
        for(let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount).fill(0);
        }
    }

    mutate(mutationRate = 0.1, mutationAmount = 0.5) {
        for (let j = 0; j < this.biases.length; j++) {
            if (Math.random() < mutationRate) {
                this.biases[j] += (Math.random() * 2 - 1) * mutationAmount;
            }
        }

        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() < mutationRate) {
                    this.weights[i][j] += (Math.random() * 2 - 1) * mutationAmount;
                }
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

    mutateNetwork(mutationRate = 0.1, mutationAmount = 0.5) {
        for(let i = 0; i < this.levels.length; i++) {
            this.levels[i].mutate(mutationRate, mutationAmount);
        }
    }
}
let gilberts = 0;
class Creature {
    constructor(xCoordinate = 0, yCoordinate = 0, eyeCount = 2) {
        this.x = xCoordinate; //x coordinate. number between 0 and 1 that is a ratio of how far across the square it is
        this.y = yCoordinate; //y coordinate. number between 0 and 1 that is a ratio of how far across the square it is
        
        this.vx = 0;
        this.vy = 0;

        this.id = gilberts;
        gilberts++;

        this.v = 0; //velocity
        this.r = Math.random(); //rotational degree
        this.rv = 0; //rotational speed

        this.sight = new Array(eyeCount).fill(1);

        this.net = new NeuralNetwork([[5, 'tanh'], [7, 'tanh'], [7, 'tanh'], [2, 'tanh']]);

        // Schedule the creature to be killed after 10 seconds
        setTimeout(() => {
            // Remove this creature from the `gilbert` array based on its `id`
            gilbert = gilbert.filter(creature => creature.id !== this.id);
        }, 10000); // 10000 ms = 10 seconds
    }

    run(n1 = 1, n2 = this.x, n3 = this.y, n4 = this.v, n5 = this.r) {
        this.net.levels[0].inputs = [n1, n2, n3, n4, n5];
        return NeuralNetwork.feedForward(this.net);
    }

    move() {
        this.r += this.rv / 200;
        this.rv *= 0.99;
    
        const radians = this.r * 360 * (Math.PI / 180);
        const deltaX = this.v * Math.sin(radians);
        const deltaY = this.v * -Math.cos(radians);
    
        this.vx += deltaX / 180;
        this.vy += deltaY / 180;
    
        this.vx *= 0.93;
        this.vy *= 0.93;
    
        this.x += this.vx / 100;
        this.y += this.vy / 100;   
    }
    draw() {
        ctx.save(); // Save the current context state
        ctx.translate(this.x * canvas.width, this.y * canvas.height); // Translate to the creature's position
        ctx.rotate(this.r * Math.PI / 180); // Rotate the context to the creature's rotation
        
        ctx.beginPath(); // Begin a new path
        ctx.arc(0, 0, 4, 0, Math.PI * 2); // Change radius to 5 (or to your desired size)
        ctx.fillStyle = '#FFA500'; // Set a fill color
        ctx.fill(); // Fill the circle
        ctx.restore(); // Restore the context state
    }
}

class Food {
    constructor() {
        this.x = Math.random();
        this.y = Math.random();
    }

    draw() {
        ctx.save(); // Save the current context state
        ctx.translate(this.x * canvas.width, this.y * canvas.height); // Translate to the creature's position
        ctx.rotate(this.r * Math.PI / 180); // Rotate the context to the creature's rotation
        
        ctx.beginPath(); // Begin a new path
        ctx.arc(0, 0, 4, 0, Math.PI * 2); // Change radius to 5 (or to your desired size)
        ctx.fillStyle = '#964B00'; // Set a fill color
        ctx.fill(); // Fill the circle
        ctx.restore(); // Restore the context state
    }
}

let gilbert = [];
let gilbertCount = 1000;
let foodCount = 100;

for(let i = 0; i < gilbertCount; i++) {
    gilbert.push(new Creature(0.5 + (Math.random() * 2 - 1)/10, 0.5 + (Math.random() * 2 - 1)/10));
    gilbert[i].net.mutateNetwork(1, 1);
}


function updateCreatures() {
    ctx.clearRect(0, 0, 900, 900);

    gilbert.forEach((creature) => {
        creature.draw();
        creature.move();
        let idea = creature.run();
        creature.v += idea[0];
        creature.rv += idea[1];
        creature.v = Math.max(-5, Math.min(12.5, creature.v));
        creature.rv = Math.max(-6, Math.min(6, creature.rv));
    });

    console.log(gilbert.length);

    gilbert = gilbert.filter(creature => !(creature.x > 29/30 || creature.x < -1/30 || creature.y > 29/30 || creature.y < -1/30));

    requestAnimationFrame(updateCreatures);
}

console.table(gilbert[0].net.levels);
console.table(gilbert[0].run())
requestAnimationFrame(updateCreatures);