import React from "react";
import {Button, Text, View} from "react-native";

const Games = ({ navigation }) => {
    return (
        <View>
            <Button title="Jumper" onPress={() => {
                navigation.navigate("Jumper");
            }} />
        </View>
    );
}

export default Games;
