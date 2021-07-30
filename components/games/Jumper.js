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
const platformSpeed = 2;

class Jumper extends React.Component {
    constructor(props) {
        super(props);

        this.shouldJump = false;
        this.resets = 0;

        this.state = {
            velocity: 0,
            y: floor,
            platforms: [{x: 0, width: Dimensions.get('window').width * 2}]
        };
    }

    /**
     * Takes in a list of platforms and moves them all to the left
     * -platformSpeed distance.
     * Will Remove all of the platforms that have moved off screen
     * Will add new platforms as needed
     * @param platforms - an array of platform objects
     * @return a new array of new platforms
     */
    movePlatforms = (platforms) => {
        const result = [];

        platforms.forEach(platform => {
            // create new object
            const newPlatform = {
                x: platform.x - platformSpeed,
                width: platform.width
            }

            // don't add if offscreen
            if (newPlatform.x + newPlatform.width > 0) {
                result.push(newPlatform)
            }
        })

        return result;
    }

    /**
     * Detects if the player is standing on a platform
     * @param state - the current state of the app, includes player and platform info
     * @param y - the new y value of the player after applying the velocity
     * @returns {boolean} - true if there is a platform under the player, false otherwise
     */
    isFloor(state, y) {
        const x = this.getPlayerXPos();
        return state.platforms.some(platform => {
            return x >= platform.x && x <= platform.x + platform.width;
        });
    }

    update = () => {
        this.setState((prev) => {
            let vel = prev.velocity;

            if (this.shouldJump && this.resets < maxJumpResets) {
                vel = jumpSpeed;
                this.resets++;
            }

            let y = prev.y - vel;
            if (this.isFloor(prev, y) && y >= floor) {
                y = floor;
                vel = 0;
            } else {
                vel = vel - acceleration;
            }
            return {
                y: y,
                velocity: vel,
                platforms: this.movePlatforms(prev.platforms)
            }
        });
    }

    // TODO: Very short press can result in not jumping
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

    getPlayerXPos = () => {
        return (Dimensions.get('window').width - playerWidth) / 2;
    }

    render() {
        return (
            <GameEngine updateFunction={this.update}
                        onPressIn={this.onPressIn}
                        onPressOut={this.onPressOut}>
                <View style={[styles.player, {
                        top: this.state.y,
                        left: this.getPlayerXPos()
                    }]}/>
                {this.state.platforms.map((platform, index) =>
                    <View key={index} style={[styles.platform, {
                        left: platform.x,
                        width: platform.width
                    }]}/>
                )}
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
        height: platformHeight,
        top: floor + playerHeight
    }
})

export default Jumper;
