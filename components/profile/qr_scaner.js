
import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, TouchableOpacity, Image, Dimensions} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import 'react-native-gesture-handler';
import Svg, {Path} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import {SafeAreaView} from "react-native-safe-area-context";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [manager_success_popup, setManagerSuccessPopup] = useState(false);
    const [manager_false_popup, setManagerFalsePopup] = useState(false);
    const [name, setName] = useState(false);


    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        if (isNaN(data)) {
            alert ('The QR Code is wrong');
            return false;
        }


        console.log(data)
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        console.log(AuthStr, 'hhhhhhhhjjjjj')
        console.log(`https://appbonus.justcode.am/api/ScanUser/user_id=${data}`);
        try {
            fetch(`https://appbonus.justcode.am/api/ScanUser/user_id=${data}` , {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'qrCode')
                if (response.status === true) {

                    setName(response.user.name);
                    setManagerSuccessPopup(true);
                    setManagerFalsePopup(false);
                } else {
                   if  (response.message == 'wrong  user id') {
                        alert ('The QR Code is wrong');
                   } else if (response.message == 'wrong  qr code') {
                       setManagerSuccessPopup(false);
                       setManagerFalsePopup(true);
                   }
                }
            })
        } catch (e) {
            console.log(e)
        }
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

   const redirectToManager = () => {
        props.navigation.navigate("Manager");
    }



    return (
        <View style={styles.container}>

            {manager_success_popup &&
                <View style={styles.manager_success_popup}>
                <View style={styles.manager_success_popup_wrapper}>
                    <Text style={styles.name}>{name}</Text>
                    {/*<TouchableOpacity*/}
                    {/*    style={{width: '100%', position: 'absolute', left: 30, top: 60}}*/}
                    {/*    onPress={() => {*/}
                    {/*        setManagerSuccessPopup(false);*/}
                    {/*        props.navigation.navigate('Manager')*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Svg width={25} height={25} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*        <Path*/}
                    {/*            d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z"*/}
                    {/*            fill="#004B84"*/}
                    {/*        />*/}
                    {/*    </Svg>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={styles.manager_success_popup_icon}>
                        <Image style={styles.manager_success_popup_icon_img} source={require('../../assets/images/popup_img1.png')}/>
                    </View>
                    <Text style={styles.manager_success_popup_title}>Usuario activo</Text>
                    <TouchableOpacity
                        style={styles.manager_success_popup_btn}
                        onPress={() => {
                            setManagerSuccessPopup(false);
                            props.navigation.navigate('Manager')
                        }}
                    >
                        <Text style={styles.manager_success_popup_btn_text}>enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }

            {manager_false_popup &&
                 <View style={styles.manager_success_popup}>
                <View style={styles.manager_success_popup_wrapper}>
                    <Text style={styles.name}>{name}</Text>
                    {/*<TouchableOpacity*/}
                    {/*    style={{width: '100%', position: 'absolute', left: 30, top: 60}}*/}
                    {/*    onPress={() => {*/}
                    {/*        setManagerFalsePopup(false);*/}
                    {/*    }}>*/}
                    {/*    <Svg width={25} height={25} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*        <Path*/}
                    {/*            d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z"*/}
                    {/*            fill="#004B84"*/}
                    {/*        />*/}
                    {/*    </Svg>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={styles.manager_success_popup_icon2}>
                        <Image style={styles.manager_success_popup_icon_img} source={require('../../assets/images/popup_img2.png')}/>
                    </View>
                    <Text style={[styles.manager_success_popup_title, {width: 176,}]}>El usuario
                        no está activo</Text>
                    <TouchableOpacity
                        style={styles.manager_success_popup_btn}
                        onPress={() => {
                            setManagerFalsePopup(false);
                        }}
                    >
                        <Text style={styles.manager_success_popup_btn_text}>enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }

            <BarCodeScanner

                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <TouchableOpacity style={{position:'absolute', top: 50, left: 20}}  onPress={() => redirectToManager()}>
                <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 35 35"
                    fill="none"
                >
                    <Path
                        d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                        fill="#4D5DFA"
                    />
                </Svg>
            </TouchableOpacity>

            <View style={{position:'absolute', width: '100%', bottom: 0}}>
                {scanned &&
                // <Button  buttonStyle={styles.button}   color='#4D5DFA' title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                <TouchableOpacity style={{ backgroundColor: '#4D5DFA',  height: 100, justifyContent:'center', alignItems:'center',}} onPress={() => setScanned(false)}>
                    <Text style={{color: '#ffffff', fontSize: 20, fontWeight: '500'}}>Tap to Scan Again</Text>
                </TouchableOpacity>
                }
            </View>
            {/*{scanned && <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: '#4D5DFA', borderRadius: 7, width: '100%'}} onPress={() => setScanned(false)} > <Text>Tap to Scan Again</Text> </TouchableOpacity>}*/}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    },
    button: {
        backgroundColor: '#4D5DFA',
        borderRadius: 7,
        width: '100%',
        height: 50
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    topPanel:{
        backgroundColor:'white',
        width:'100%',
        height:56,
        zIndex:555,
        paddingLeft:12,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection:'row'
    },
    manager_success_popup: {
        backgroundColor:  '#ffffff',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        // alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    manager_success_popup_wrapper: {
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
        // backgroundColor: 'red',
        paddingTop: 150,
        paddingHorizontal: 30,
        backgroundColor: '#ffffff'
    },
    manager_success_popup_icon: {
        width: 194,
        height: 223,
        marginBottom: 28,
    },
    manager_success_popup_icon2: {
        width: 194,
        height: 194,
        marginBottom: 28,
    },
    manager_success_popup_icon_img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    manager_success_popup_title: {
        marginBottom: 199,
        color: '#000000',
        fontSize: 25,
        fontWeight: '400',
        textAlign: 'center'
    },
    manager_success_popup_btn: {
        borderRadius: 7,
        backgroundColor: '#4D5DFA',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    manager_success_popup_btn_text: {
        color: '#ffffff',
        fontSize: 21,
        fontWeight: '400',
    },
    name: {
        fontSize: 21,
        fontWeight: '400',
        color: '#000000',
        marginBottom: 20
    }
});