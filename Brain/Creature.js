const { json } = require('express');
const Network = require('./NeuralNetwork.js');
const fs = require('fs');

class Creature {
    constructor(xCoordinate = 0, yCoordinate = 0, eyeCount = 2) {
        this.x = xCoordinate; //x coordinate. number between 0 and 1 that is a ratio of how far across the square it is
        this.y = yCoordinate; //y coordinate. number between 0 and 1 that is a ratio of how far across the square it is

        this.v = 0; //velocity
        this.r = 0; //rotational degree

        this.sight = new Array(eyeCount).fill(1);

        this.net = new Network([[5, 'tanh'], [7, 'tanh'], [7, 'tanh'], [2, 'tanh']]);
    }

    run(n1 = 1, n2 = this.x, n3 = this.y, n4 = this.sight[0], n5 = this.sight[1], n6 = this.v, n7 = this.r) {
        return Network.feedForward(this.net);
    }
}

let gilbert = new Creature()

const jsonString = JSON.stringify(gilbert, null, 2);

fs.writeFile('gilbert.json', jsonString, err => {
    if(err) {
        console.error('GILBERT HAS BEEN SLAIN')
    } else {
        console.log('Gilberts chill')
    }
})

console.table(gilbert.run())

module.exports = Creature;