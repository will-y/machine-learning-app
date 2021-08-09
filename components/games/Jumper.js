import React from "react";
import {StyleSheet, View, Dimensions, TextComponent, Button, Text} from "react-native";
import GameEngine from "./GameEngine";

const acceleration = 1;
const floor = Dimensions.get("window").height - 200;
const jumpSpeed = 10;
const maxJumpResets = 15;
const playerHeight = 20;
const playerWidth = 20;
const platformHeight = 20;
const platformSpeed = 2;
const minPlatformGap = 30;
const maxPlatformGap = 85;
const maxSpeed = 14;

export const defaultState = {
    velocity: 0,
    y: floor,
    platforms: [{x: 0, width: Dimensions.get('window').width * 2}],
    dead: false,
    score: 0,
    platformGapCounter: 0,
    platformGapMax: Dimensions.get('window').width,
    platformSpeed: platformSpeed,
    resets: 0,
    shouldJump: false
}


class Jumper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState
        }
    }

    reset = () => {
        this.resets = 0;

        this.setState({
            ...defaultState
        });
    }

    update = (touching) => {
        this.setState((prev) => stateUpdateFunction(prev, touching));
    }

    render() {
        return (
            <View style={styles.container}>
                <GameEngine updateFunction={this.update}>
                    <Text style={styles.score}>Score: {this.state.score}</Text>
                    <View style={[styles.player, {
                        top: this.state.y,
                        left: getPlayerXPos()
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

// Functions for manipulating the state
// Shouldn't depend on the class component other than the state
// Used for training
/**
 * Function to be called by set state
 * Returns the new state object to be merged into the old state
 * Also used in training to be able to use the update function without needing to deal with React states
 * These functions shouldn't require access to anything in the class other than state
 * @param prev - the previous state
 * @param touching - true if the user is currently touching the screen
 * @returns object to be merged into the old state to become the new state
 */
export const stateUpdateFunction = (prev, touching) => {
    if (!prev.dead) {
        let vel = prev.velocity;
        let jumpResets = prev.resets;
        let shouldJump = prev.shouldJump;
        if (touching && !shouldJump && prev.y === floor) {
            shouldJump = true;
        }

        if (!touching && shouldJump) {
            shouldJump = false;
            jumpResets = 0;
        }

        if (shouldJump && jumpResets < maxJumpResets) {
            vel = jumpSpeed;
            jumpResets++;
        }

        let y = prev.y - vel;
        if (isFloor(prev, y) && y >= floor - maxSpeed / 2 && y <= floor + maxSpeed / 2) {
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
            dead: checkDeath(y),
            score: prev.score + 1,
            ...addPlatforms(prev),
            platformSpeed: platformSpeed + Math.floor(prev.score / 1000),
            resets: jumpResets,
            shouldJump: shouldJump
        }
    } else {
        return {};
    }
}

const addPlatforms = prev => {
    let newCounter = prev.platformGapCounter + prev.platformSpeed;
    let newPlatforms = movePlatforms(prev.platforms, prev.platformSpeed);
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
 * Takes in a list of platforms and moves them all to the left
 * -platformSpeed distance.
 * Will Remove all of the platforms that have moved off screen
 * Will add new platforms as needed
 * @param platforms - an array of platform objects
 * @param speed - the speed that the platforms move
 * @return a new array of new platforms
 */
const movePlatforms = (platforms, speed) => {
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

/**
 * Checks if the player has fallen off the screen in order to trigger the death screen
 * @param y - y position of the player
 * @return {boolean} true if player should die
 */
const checkDeath = y => {
    return (y > Dimensions.get('window').height);
}

/**
 * Detects if the player is standing on a platform
 * @param state - the current state of the app, includes player and platform info
 * @param y - the new y value of the player after applying the velocity
 * @returns {boolean} - true if there is a platform under the player, false otherwise
 */
const isFloor = (state, y) => {
    const x = getPlayerXPos();
    return state.platforms.some(platform => {
        return x + playerWidth >= platform.x - 3 && x <= platform.x + platform.width + 3;
    });
}

export const getPlayerXPos = () => {
    return (Dimensions.get('window').width - playerWidth) / 2;
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
