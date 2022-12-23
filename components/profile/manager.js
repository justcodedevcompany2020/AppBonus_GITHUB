import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask, Pattern, Use} from "react-native-svg";
// import * as Notifications from 'expo-notifications';

import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import QRCode  from 'react-native-qrcode-svg';
import 'react-native-gesture-handler';

import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform,
    Keyboard, Linking, Pressable
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {

            manager_success_popup: false,
            manager_false_popup: false,
            footer_info: [],

            keyboard_shown: false,
        }

    }




    static contextType = AuthContext;



    getFooterInfo = () => {
        try {
            fetch(`https://appbonus.justcode.am/api/CompanyInfo`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'footer')
                this.setState({
                    footer_info: response.data[0]
                })
            })
        } catch (e) {
            console.log(e)
        }

    }





    componentDidMount() {
        const { navigation } = this.props;
        this.checkUserType();
        this.getFooterInfo;
        this.focusListener = navigation.addListener("focus", () => {
            this.checkUserType();
            this.getFooterInfo();
        });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }



    _keyboardDidShow = () => {
        this.setState({
            keyboard_shown: true
        })

    }

    _keyboardDidHide = () => {
        this.setState({
            keyboard_shown: false
        })

    }



    checkUserType = async () => {
        let userData = await AsyncStorage.getItem('userData');
        userData = JSON.parse(userData);

        if (userData.role_id == 3) {
            this.props.navigation.navigate("User");
        }
    }


    redirectToLogin = () => {
        this.props.navigation.navigate("Login");

    }

    openQrScannerPage = () => {
        this.props.navigation.navigate("QrScanner");
    }



    logOut = () => {
        this.context.signOut(() => {
            this.props.navigation.navigate('Login')

        }).then(r => console.log("logOut"));
    }

    getPrivacyPolicy = async () => {

        try {
            fetch(`https://appbonus.justcode.am/api/GetPolicy`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'privacy policy')

                let file =  'https://appbonus.justcode.am/uploads/' + response.data[0].file;
                console.log(file)
                Linking.openURL(file)

            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {



        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />

                <View style={styles.header}>
                    <TouchableOpacity style={{width: '100%', alignItems: 'flex-end', position: 'absolute', right: 20, top: 20, zIndex: 999}} onPress={() => this.logOut()}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            width={40}
                            height={40}
                            fill='#4D5DFA'
                        >
                            <Defs></Defs>
                            <G id="logout">
                                <Path className="cls-1" d="M15.92 16L28.92 16"  stroke='#4D5DFA'/>
                                <Path d="M23.93 25v3h-16V4h16v3h2V3a1 1 0 00-1-1h-18a1 1 0 00-1 1v26a1 1 0 001 1h18a1 1 0 001-1v-4z" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M28.92 16L24.92 20" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M28.92 16L24.92 12"  stroke='#4D5DFA'/>
                                <Path className="cls-1" d="M24.92 8.09L24.92 6.09" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M24.92 26L24.92 24" stroke='#4D5DFA' />
                            </G>
                        </Svg>
                    </TouchableOpacity>
                    <View style={styles.header_img_box}>
                        {/*<Image style={styles.header_child_img} source={require('../../assets/images/logo.png')}/>*/}
                        <Image style={styles.header_child_img} source={require('../../assets/images/logo3.png')}/>
                    </View>

                </View>


                <ScrollView style={styles.login_wrapper}>
                    <TouchableOpacity style={styles.qr_scanner_btn} onPress={() => this.openQrScannerPage()}>
                        <Text style={styles.qr_scanner_btn_text}>Escanear qr</Text>
                    </TouchableOpacity>

                </ScrollView>

                {!this.state.keyboard_shown &&
                <View style={styles.footer}>
                    {/*<Text style={styles.footer_title}>Contactos</Text>*/}
                    <View style={styles.footer_wrapper}>
                        <View style={styles.footer_item}>
                            <View style={styles.footer_icon}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <G clipPath="url(#clip0_586_15130)">
                                        <Path
                                            d="M2.5 2.5h15a.833.833 0 01.834.833v13.334a.833.833 0 01-.834.833h-15a.833.833 0 01-.833-.833V3.333A.833.833 0 012.5 2.5zm7.55 7.236L4.707 5.198l-1.08 1.27 6.434 5.463 6.318-5.467-1.09-1.26-5.238 4.532z"
                                            fill="#fff"
                                        />
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_586_15130">
                                            <Path fill="#fff" d="M0 0H20V20H0z" />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </View>
                            <Text style={styles.footer_info}>{this.state.footer_info.email}</Text>

                        </View>
                        <View style={styles.footer_item}>
                            <View style={styles.footer_icon}>
                                <Svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <G clipPath="url(#clip0_586_15129)">
                                        <Path
                                            d="M17.5 13.683v2.947a.833.833 0 01-.775.832c-.364.025-.662.038-.892.038C8.47 17.5 2.5 11.53 2.5 4.167c0-.23.013-.528.038-.892A.833.833 0 013.37 2.5h2.947a.417.417 0 01.415.375c.019.192.036.344.053.46.166 1.156.505 2.28 1.007 3.334a.38.38 0 01-.123.473L5.871 8.427a10.872 10.872 0 005.703 5.703l1.284-1.795a.385.385 0 01.477-.124c1.054.5 2.178.84 3.333 1.004.116.017.269.035.459.053a.417.417 0 01.374.415H17.5z"
                                            fill="#fff"
                                        />
                                    </G>
                                    <Defs>
                                        <ClipPath id="clip0_586_15129">
                                            <Path fill="#fff" d="M0 0H20V20H0z" />
                                        </ClipPath>
                                    </Defs>
                                </Svg>
                            </View>
                            <Text style={styles.footer_info}>{this.state.footer_info.phone}</Text>
                        </View>
                    </View>
                    <Pressable style={styles.privacy_policy_btn}  onPress={ () => {this.getPrivacyPolicy()} }>
                        <Text  style={styles.privacy_policy_btn_text}>Política de privacidad</Text>
                    </Pressable>
                </View>
                }

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",




    },
    header: {
      width: '100%',
        position: 'relative',
        paddingTop: 80,

    },


    header_img_box: {
        width: '100%',
        // maxWidth: 256,
        // height: 227,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',

    },
    header_child_img: {
        width: 280,
        height: 143,
        resizeMode: 'cover',
        alignSelf:'center',
        marginBottom:30
    },
    login_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 26,
        paddingTop: 20
    },

    qr_scanner_btn: {
        width: '100%',
        borderRadius: 7,
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 50,

    },
    qr_scanner_btn_text: {
        color: '#000000',
        fontSize: 21,
        fontWeight: '400',
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
        paddingTop: 233,
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
    footer: {
        width: '100%',
        backgroundColor: '#4D5DFA',
        paddingTop: 20,
        paddingBottom: 20,
        // position: 'absolute',
        // bottom:0,
        // justifyContent:'space-between',
        // flexDirection: 'row',
        alignItems: 'center'
    },
    footer_info: {
        fontWeight: '400',
        fontSize: 16,
        color: '#ffffff',
    },
    footer_title: {
        fontSize: 21,
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: 10
    },
    footer_item: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginRight: 10
    },
    footer_icon: {
        marginRight: 5
    },


    footer_wrapper: {
        flexDirection: 'row',
        // width: 150,
        paddingHorizontal: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    privacy_policy_btn: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    privacy_policy_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 14,
    }


});
