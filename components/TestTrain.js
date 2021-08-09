import React from "react";
import {Button, Text, View} from "react-native";
import {stateUpdateFunction, getPlayerXPos, defaultState} from "./games/Jumper";
let { NEAT, activation, crossover, mutate } = require('neat_net-js');

const populationSize = 100;
const generations = 10;

const config = {
    model: [
        {nodeCount: 2, type: "input"},
        {nodeCount: 2, type:"output", activationfunc: activation.RELU}
    ],
    mutationRate: 0.05,
    crossoverMethod: crossover.RANDOM,
    mutationMethod: mutate.RANDOM,
    populationSize: populationSize
}

const neat = new NEAT(config);

class TestTrain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fitnessArray: []
        }
    }

    testTrain = () => {
        const fitnessArray = [];
        for (let gen = 0; gen < generations; gen++) {
            for (let i = 0; i < populationSize; i++) {
                let state = {...defaultState};

                while (!state.dead) {
                    const vision = this.getEasyVision(state.platforms);
                    neat.setInputs(vision, i);
                    neat.creatures[i].feedForward();
                    state = {
                        ...state,
                        ...stateUpdateFunction(state, neat.creatures[i].desicion() === 1)
                    }
                }

                neat.setFitness(state.score, i);
            }

            neat.doGen();
            console.log(neat.creatures[neat.bestCreature()].score);
            fitnessArray.push(neat.creatures[neat.bestCreature()].score);
        }
        this.setState({
            fitnessArray: fitnessArray
        })
    }

    /**
     * Takes in the array of platforms
     * Returns an array of size 2.
     * The first element is the distance from the player until the next gap
     * The second element is the distance to the next platform
     */
    getEasyVision = platforms => {
        const x = getPlayerXPos();
        const platform = this.findPlatformStandingOn(platforms, x);
        const distanceToNext = this.findDistanceToNextPlatform(platforms, x);

        if (platform === -1) {
            return [0, distanceToNext];
        }

        return [platforms[platform].x + platforms[platform].width - x, distanceToNext];
    }

    /**
     * Finds the index of the platform that the player is standing on
     * NOTE: Doesn't care about if the player is in the air or not, only what is below them
     * @param platforms - array of platforms
     * @param playerX - the x value of the player
     * @returns {int} index of the platform that the player is standing on, -1 if not over one
     */
    findPlatformStandingOn = (platforms, playerX) => {
        for (let i = 0; i < platforms.length; i++) {
            if (platforms[i].x <= playerX && platforms[i].x + platforms[i].width >= playerX) {
                return i;
            }
        }

        return -1;
    }

    findDistanceToNextPlatform = (platforms, playerX) => {
        let i;
        for (i = 0; i < platforms.length; i++) {
            if (platforms[i].x > playerX) {
                break;
            }
        }

        if (i === platforms.length) {
            return getPlayerXPos();
        }

        return platforms[i].x - playerX;
    }

    /**
     * Takes the array of platforms and gets the x distance to and width of the platform closest to the left and the
     * platform closest to the right.
     * @param platforms
     */
    getPlatformVision = platforms => {
        const x = getPlayerXPos();

        let closestPlatformLeft = 0;
        let closestPlatformRight = platforms.length - 1;
        let rightLocked = false;

        platforms.map(plat => plat.x).forEach((platX, index) => {
            if (platX < x) {
                closestPlatformLeft = index;
            }

            if (!rightLocked && platX > x) {
                closestPlatformRight = index;
                rightLocked = true;
            }
        });

        return [platforms[closestPlatformLeft].x, platforms[closestPlatformLeft].width, platforms[closestPlatformRight].x, platforms[closestPlatformRight].width];
    }

    render() {
        return (
            <View>
                <Text>Training Component</Text>
                <Button title="Test" onPress={this.testTrain} />
                {this.state.fitnessArray.map((item, index) => {
                    return <Text key={index}>{index}: {item}</Text>
                })

                }
            </View>
        );
    }
}

export default TestTrain;
