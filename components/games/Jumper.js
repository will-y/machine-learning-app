import React from "react";
import { View } from "react-native";
import GameEngine from "./GameEngine";

class Jumper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };
    }

    update = () => {
        this.setState((prev, props) => {
            return {
                x: prev.x + 1,
                y: prev.y + 1
            }
        });
    }

    render() {
        return (
            <GameEngine updateFunction={this.update}>
                <View style={{left: this.state.x, top: this.state.y, position: "absolute", backgroundColor: "green", width: 100, height: 100}} />
            </GameEngine>
        );
    }
}

export default Jumper;
