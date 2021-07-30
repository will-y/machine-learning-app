import React from "react";
import {StyleSheet, View, Dimensions} from "react-native";
import GameEngine from "./GameEngine";

const acceleration = 1;
const floor = Dimensions.get("window").height - 200;
const jumpSpeed = 10;
const maxJumpResets = 15;
const playerHeight = 50;
const playerWidth = 20;
const platformHeight = 20;

class Jumper extends React.Component {
    constructor(props) {
        super(props);

        this.shouldJump = false;
        this.resets = 0;


        this.state = {
            velocity: 0,
            y: floor
        };
    }

    update = () => {
        this.setState((prev) => {
            let vel = prev.velocity;

            if (this.shouldJump && this.resets < maxJumpResets) {
                vel = jumpSpeed;
                this.resets++;
            }

            let y = prev.y - vel;
            if (y > floor) {
                y = floor;
                vel = 0;
            } else {
                vel = vel - acceleration;
            }
            return {
                y: y,
                velocity: vel
            }
        });
    }

    onPressIn = () => {
        console.log("press in");
        if (this.state.y === floor) {
            this.shouldJump = true;
        }
    }

    onPressOut = () => {
        console.log("press out");
        this.shouldJump = false;
        this.resets = 0;
    }

    render() {
        return (
            <GameEngine updateFunction={this.update}
                        onPressIn={this.onPressIn}
                        onPressOut={this.onPressOut}>
                <View style={[styles.player,
                    {
                        top: this.state.y,
                        left: (Dimensions.get('window').width - playerWidth) / 2
                    }]} />
                <View style={styles.platform} />
            </GameEngine>
        );
    }
}

const styles = StyleSheet.create({
    player: {
        position: "absolute",
        backgroundColor: "green",
        width: playerWidth,
        height: playerHeight
    },
    platform: {
        position: "absolute",
        backgroundColor: "black",
        width: 100,
        height: 20,
        top: floor + playerHeight,
        left: Dimensions.get('window').width / 2 - 50
    }
})

export default Jumper;
