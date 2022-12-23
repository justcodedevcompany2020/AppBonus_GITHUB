import React, { Component } from 'react';
import Svg, { Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask, Pattern, Use } from "react-native-svg";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';

const data = [
    { id: 1, textFirst: '1 mes', textSecond: '1,99 €' },
    { id: 2, textFirst: '3 meses', textSecond: '1,99 €' },
    { id: 3, textFirst: '12 meses', textSecond: '1,99 €' }
]

export default class Traffics extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}  >
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("User")}
                    style={styles.back} >
                    <Svg width="22" height="37" viewBox="0 0 22 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M19 3L4 18.2933L19 34" stroke="#BABABA" stroke-width="5" stroke-linecap="round" />
                    </Svg>
                </TouchableOpacity>
                <View style={styles.divFirst} >
                    <Text style={styles.textTarifas} >Tarifas</Text>
                </View>
                {data.map((value, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.tariffasBlock} >
                            <Text style={styles.blockText} >{value.textFirst}</Text>
                            <Text style={styles.blockText} >{value.textSecond}</Text>
                        </TouchableOpacity>
                    )
                })}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",
        paddingTop: 50,
    },
    back: {
        marginLeft: 30,
        marginTop: 58
    },
    divFirst: {
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 130,
        marginBottom: 50
    },
    textTarifas: {
        fontSize: 32,
        color: '#000000'
    },
    tariffasBlock: {
        width: '90%',
        backgroundColor: '#4D5DFA',
        height: 62,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30
    },
    blockText: {
        color: 'white',
        fontSize: 21,
        fontWeight: '400'
    }
})