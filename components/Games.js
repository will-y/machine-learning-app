import React from "react";
import {StyleSheet, Button, Text, View, ScrollView} from "react-native";

// A list of game titles, will automatically generate the menu components
// Playable game components should be in games/Title.js
// Should have route setup as title of the game
// TODO: Training components
const gamesList = ["Jumper"];

// TODO: add a search bar when there are multiple games

const Games = ({ navigation }) => {
    return (
        <ScrollView>
            {gamesList.map((title, index) => {
                return (
                    <View style={styles.gameWrapper} key={index}>
                        <Text style={styles.text}>{title}</Text>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} title="Play" onPress={() => {
                                navigation.navigate(title)
                            }} />
                            <Button style={styles.button} title="Train" onPress={() => {}} />
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    gameWrapper: {
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "black",
        margin: 10,
        borderRadius: 5
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10
    },
    text: {
        textAlign: "center",
        fontSize: 25
    },
    button: {
        flex: 2
    }
});

export default Games;
