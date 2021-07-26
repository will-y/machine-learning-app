import React from 'react';
import {StyleSheet, Button, Text, View} from "react-native";

const Home = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Neural Network Trainer</Text>
            <Button style={styles.menuButton}
                    title="Games"
                    onPress={() => {
                        navigation.navigate('Games')
                    }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 40,
        textAlign: "center"
    },
    menuButton: {
        marginTop: 50
    }
});

export default Home;
