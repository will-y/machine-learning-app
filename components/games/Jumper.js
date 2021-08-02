import React from "react";
import {StyleSheet, View, Dimensions, TextComponent, Button, Text} from "react-native";
import GameEngine from "./GameEngine";

const acceleration = 1;
const floor = Dimensions.get("window").height - 200;
const jumpSpeed = 10;
const maxJumpResets = 15;
const playerHeight = 50;
const playerWidth = 20;
const platformHeight = 20;
const platformSpeed = 2;
const minPlatformGap = 30;
const maxPlatformGap = 85;
const maxSpeed = 14;

const defaultState = {
    velocity: 0,
    y: floor,
    platforms: [{x: 0, width: Dimensions.get('window').width * 2}],
    dead: false,
    score: 0,
    platformGapCounter: 0,
    platformGapMax: Dimensions.get('window').width,
    platformSpeed: platformSpeed
}

class Jumper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState
        }

        this.shouldJump = false;
        this.resets = 0;
    }

    reset = () => {
        this.shouldJump = false;
        this.resets = 0;

        this.setState({
            ...defaultState
        });
    }

    /**
     * Takes in a list of platforms and moves them all to the left
     * -platformSpeed distance.
     * Will Remove all of the platforms that have moved off screen
     * Will add new platforms as needed
     * @param platforms - an array of platform objects
     * @return a new array of new platforms
     */
    movePlatforms = (platforms, speed) => {
        const result = [];

        platforms.forEach(platform => {
            // create new object
            const newPlatform = {
                x: platform.x - speed,
                width: platform.width
            }

            // don't add if offscreen
            if (newPlatform.x + newPlatform.width > 0) {
                result.push(newPlatform)
            }
        })

        return result;
    }

    addPlatforms = prev => {
        let newCounter = prev.platformGapCounter + prev.platformSpeed;
        let newPlatforms = this.movePlatforms(prev.platforms, prev.platformSpeed);
        let newMaxCounter = prev.platformGapMax;

        if (prev.platformGapCounter >= prev.platformGapMax) {
            newCounter = 0;
            const width = Math.floor(Math.random() * 200) + 50;
            newPlatforms.push({
                x: Dimensions.get("window").width,
                width: width
            });
            newMaxCounter = width + Math.floor(Math.random() * (maxPlatformGap + Math.floor(prev.score / 1000) * 50 - minPlatformGap)) + minPlatformGap;
        }

        return {
            platformGapCounter: newCounter,
            platforms: newPlatforms,
            platformGapMax: newMaxCounter
        }
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
            return x + playerWidth / 2 >= platform.x - 3 && x - playerWidth / 2 <= platform.x + platform.width + 3;
        });
    }

    update = () => {
        this.setState((prev) => {
            if (!prev.dead) {
                let vel = prev.velocity;

                if (this.shouldJump && this.resets < maxJumpResets) {
                    vel = jumpSpeed;
                    this.resets++;
                }

                let y = prev.y - vel;
                if (this.isFloor(prev, y) && y >= floor - maxSpeed / 2 && y <= floor + maxSpeed / 2) {
                    y = floor;
                    vel = 0;
                } else {
                    vel = vel - acceleration;
                    if (Math.abs(vel) > maxSpeed) {
                        vel = Math.sign(vel) * maxSpeed;
                    }
                }
                return {
                    y: y,
                    velocity: vel,
                    dead: this.checkDeath(y),
                    score: prev.score + 1,
                    ...this.addPlatforms(prev),
                    platformSpeed: platformSpeed + Math.floor(prev.score / 1000)
                }
            } else {
                return {};
            }
        });
    }

    /**
     * Checks if the player has fallen off the screen in order to trigger the death screen
     * @param y - y position of the player
     * @return {boolean} true if player should die
     */
    checkDeath = y => {
        return (y > Dimensions.get('window').height);
    }

    // TODO: Very short press can result in not jumping
    onPressIn = () => {
        if (this.state.y === floor) {
            this.shouldJump = true;
        }
    }

    onPressOut = () => {
        this.shouldJump = false;
        this.resets = 0;
    }

    getPlayerXPos = () => {
        return (Dimensions.get('window').width - playerWidth) / 2;
    }

    render() {
        return (
            <View style={styles.container}>
                <GameEngine updateFunction={this.update}
                            onPressIn={this.onPressIn}
                            onPressOut={this.onPressOut}>
                    <Text style={styles.score}>Score: {this.state.score}</Text>
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
                {this.state.dead && <View style={styles.deathContainer}>
                    <View style={styles.padding} />
                    <Text style={[styles.gameOverText, styles.gameOverComponent]}>Game Over</Text>
                    <Text style={[styles.gameOverText, styles.gameOverComponent]}>Score: {this.state.score}</Text>
                    <Button style={styles.gameOverComponent} title="Play Again" onPress={this.reset} />
                    <View style={styles.padding} />
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
    },
    deathContainer: {
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "grey",
        opacity: 0.5,
        display: "flex",
        flexDirection: "column"
    },
    gameOverText: {
        textAlign: "center",
        fontSize: 25
    },
    gameOverComponent: {
        opacity: 1
    },
    padding: {
        flex: 2
    },
    score: {
        fontSize: 20,
        textAlign: "center",
        position: "absolute",
        top: 20,
        width: "100%"
    }
})

export default Jumper;
