import React, { Component } from 'react';
import Svg, { Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask, Pattern, Use } from "react-native-svg";
// import * as Notifications from 'expo-notifications';

import { AuthContext } from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
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
    Keyboard,
    Pressable, Linking
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
            userQrCode: null,
            userQrCodeReady: false,
            active_companies: [],
            footer_info: [],

            keyboard_shown: false,
        };

    }




    static contextType = AuthContext;




    getActiveCompanyInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        try {
            fetch(`https://appbonus.justcode.am/api/ActiveCompany`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'active companies')


                if (response.hasOwnProperty('status')) {
                    if (response.status === true) {
                        this.setState({
                            active_companies: response.data,
                        })
                    }
                }

            })
        } catch (e) {
            console.log(e)
        }
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

                let file = 'https://appbonus.justcode.am/uploads/' + response.data[0].file;
                console.log(file)
                Linking.openURL(file)

            })
        } catch (e) {
            console.log(e)
        }
    }

    checkUserType = async () => {
        let userData = await AsyncStorage.getItem('userData');
        userData = JSON.parse(userData);

        console.log(userData, 'userhhhhhhhhhhhhhh')

        if (userData.role_id == 2) {
            this.props.navigation.navigate("Manager");
        }

        this.setState({
            userQrCode: userData.id.toString(),
            // userQrCode: '100',
            userQrCodeReady: true,
        })
    }


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
        this.getActiveCompanyInfo();
        this.getFooterInfo();
        this.focusListener = navigation.addListener("focus", () => {
            this.checkUserType();
            this.getActiveCompanyInfo();
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



    redirectToLogin = () => {
        this.props.navigation.navigate("Login");

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


    logOut = () => {
        this.context.signOut(() => {
            this.props.navigation.navigate('Login')

        }).then(r => console.log("logOut"));
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />
                <View style={styles.user_qr_code}>
                    <TouchableOpacity style={{ width: '100%', alignItems: 'flex-end', position: 'absolute', right: 20, top: -30 }} onPress={() => this.logOut()}>
                        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={40} height={40} fill='#4D5DFA'>
                            <Defs></Defs>
                            <G id="logout">
                                <Path className="cls-1" d="M15.92 16L28.92 16" stroke='#4D5DFA' />
                                <Path d="M23.93 25v3h-16V4h16v3h2V3a1 1 0 00-1-1h-18a1 1 0 00-1 1v26a1 1 0 001 1h18a1 1 0 001-1v-4z" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M28.92 16L24.92 20" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M28.92 16L24.92 12" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M24.92 8.09L24.92 6.09" stroke='#4D5DFA' />
                                <Path className="cls-1" d="M24.92 26L24.92 24" stroke='#4D5DFA' />
                            </G>
                        </Svg>
                    </TouchableOpacity>
                    {this.state.userQrCodeReady &&
                        <QRCode
                            value={this.state.userQrCode}
                            size={250}
                            logoBackgroundColor='transparent'
                        />

                    }

                </View>

                <Text onPress={() => this.props.navigation.navigate('Traffics')} style={styles.text_link}>Su suscripción no está activa. <Text style={styles.link}> Elegir una tarifa.</Text></Text>
                <ScrollView style={styles.user_wrapper}>

                <Text style={styles.user_title}>Lista de establecimientos</Text>

                    {this.state.active_companies.map((item, index) => {
                        return (
                            <View style={styles.user_info_item} key={index}>
                                <Text style={styles.user_info_item_title}>
                                    {item.company_name} - {item.bonus} %
                                </Text>
                                <Text style={styles.user_info_item_text}>
                                    {item.address}
                                </Text>
                            </View>
                        )
                    })}


                    {/*<View style={styles.user_info_item}>*/}
                    {/*    <Text style={styles.user_info_item_title}>*/}
                    {/*        Gourmedian - 5 %*/}
                    {/*    </Text>*/}
                    {/*    <Text style={styles.user_info_item_text}>*/}
                    {/*        Avda. Artista Remigio Soler López,*/}
                    {/*        9, 03540, Alicante*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.user_info_item}>*/}
                    {/*    <Text style={styles.user_info_item_title}>*/}
                    {/*        Gourmedian - 6 %*/}
                    {/*    </Text>*/}
                    {/*    <Text style={styles.user_info_item_text}>*/}
                    {/*        Avda. Artista Remigio Soler López,*/}
                    {/*        9, 03540, Alicante*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.user_info_item}>*/}
                    {/*    <Text style={styles.user_info_item_title}>*/}
                    {/*        Gourmedian - 6 %*/}
                    {/*    </Text>*/}
                    {/*    <Text style={styles.user_info_item_text}>*/}
                    {/*        Avda. Artista Remigio Soler López,*/}
                    {/*        9, 03540, Alicante*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
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
                        <Pressable style={styles.privacy_policy_btn} onPress={() => { this.getPrivacyPolicy() }}>
                            <Text style={styles.privacy_policy_btn_text}>Política de privacidad</Text>
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
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",
        paddingTop: 50,
    },
    text_link: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 36,
        color: '#5B5B5B'

    },
    link: {
        // alignItems:'center',
        paddingTop: 14,
        textDecorationLine: 'underline',
        textShadowColor: '#4D5DFA',
        color: '#4D5DFA'

    },
    user_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 48,
    },

    user_title: {
        marginBottom: 36,
        fontWeight: '500',
        fontSize: 20,
        color: '#000000',

    },
    user_info_item: {
        marginBottom: 30,
    },

    user_info_item_title: {
        fontWeight: '400',
        fontSize: 21,
        color: '#000000',
    },

    user_info_item_text: {
        fontWeight: '400',
        fontSize: 16,
        color: '#A6A6A6',
    },

    user_qr_code: {
        width: '100%',
        marginBottom: 36,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
        paddingHorizontal: 50,

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
