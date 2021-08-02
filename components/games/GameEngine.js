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

        this.touching = false;

        this.timerId = null;
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.stop();
    }

    pressIn = () => {
        this.touching = true;
        this.onPressIn();
    }

    pressOut = () => {
        this.touching = false;
        this.onPressOut();
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
                this.updateFunction(this.touching);
            }
        }

        this.timerId = requestAnimationFrame(this.step);
    }

    render = () => {
        return (
            <TouchableWithoutFeedback onPress={this.onPress}
                                      onPressIn={this.pressIn}
                                      onPressOut={this.pressOut}>
                <View style={styles.container}>
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
