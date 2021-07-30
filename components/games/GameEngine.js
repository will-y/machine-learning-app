import React from "react";
import {StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";

class GameEngine extends React.Component {
    constructor(props) {
        super(props);

        this.updateFunction = props.updateFunction;

        this.noop = () => {};

        this.onPressIn = this.props.onPressIn ? this.props.onPressIn : this.noop;
        this.onPressOut = this.props.onPressOut ? this.props.onPressOut : this.noop;
        this.onPress = this.props.onPress ? this.props.onPress : this.noop;

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
            <TouchableWithoutFeedback onPress={this.onPress}
                                      onPressIn={this.onPressIn}
                                      onPressOut={this.onPressOut}>
                <View style={styles.container}>
                    <Text>Game Title Goes Here</Text>
                    <View style={styles.gameContainer}>
                        {this.props.children}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: "red",
        overflow: "hidden"
    },
    container: {
        flex: 1
    }
});

export default GameEngine;
