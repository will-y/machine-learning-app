import React from "react";
import {Button, Text, View} from "react-native";
let { NEAT, activation, crossover, mutate } = require('neat_net-js');

const populationSize = 200;

const config = {
    model: [
        {nodeCount: 5, type: "input"},
        {nodeCount: 1, type:"output", activationfunc: activation.RELU}
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
    }

    testTrain = () => {
        alert("Starting Training");
        for (let i = 0; i < populationSize; i++) {

        }
    }

    render() {
        return (
            <View>
                <Text>Training Component</Text>
                <Button title="Test" onPress={this.testTrain} />
            </View>
        );
    }
}

export default TestTrain;
