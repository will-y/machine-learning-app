import React from "react";
import {StyleSheet, Text, View} from "react-native";

class GameEngine extends React.Component {
    constructor(props) {
        super(props);

        this.updateFunction = props.updateFunction;

        this.timerId = null;
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.stop();
    }

    start = () => {
        if (!this.timerId) {
            this.step();
        }
    }

    stop = () => {
        if (this.timerId) {
            cancelAnimationFrame(this.timerId);
            this.timerId = null;
        }
    }

    step = () => {
        if (this.timerId) {
            if (this.updateFunction) {
                this.updateFunction();
            }
        }

        this.timerId = requestAnimationFrame(this.step);
    }

    render = () => {
        return (
            <View style={styles.container}>
                <Text>Game Title Goes Here</Text>
                <View style={styles.gameContainer}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: "red"
    },
    container: {
        flex: 1
    }
});

export default GameEngine;
