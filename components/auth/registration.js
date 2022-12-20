import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask, Pattern, Use} from "react-native-svg";
// import * as Notifications from 'expo-notifications';

import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
    Platform, Keyboard, Pressable, Linking
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
            name: '',
            surname: '',
            email: '',
            phone: '',
            password: '',
            passwordConfirmation: '',

            name_error: false,
            name_error_text: '',

            email_error: false,
            email_error_text: '',

            phone_error: false,
            phone_error_text: '',

            password_error: false,
            password_error_text: '',

            passwordConfirmation_error: false,
            passwordConfirmation_error_text: '',

            confirm_email_code_popup: false,
            confirm_email_success_popup: false,

            code1: '',
            code1_field_error: false,
            code1_field_valid: false,

            code2: '',
            code2_field_error: false,
            code2_field_valid: false,

            code3: '',
            code3_field_error: false,
            code3_field_valid: false,

            code4: '',
            code4_field_error: false,
            code4_field_valid: false,

            code5: '',
            code5_field_error: false,
            code5_field_valid: false,

            code_main_error:false,
            code_main_error_text: '',
            new_code_sent: false,

            token: '',

            code_send_text: '',
            code_send: false,

            valid_email_error: false,
            valid_email_error_text: '',

            footer_info: [],
            keyboard_shown: false,

        };

    }




    static contextType = AuthContext;



    changeFirstCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code1:  value
            })

            if (value.length == 1) {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: true,
                })
                this.refs.secondInput.focus();
            } else {
                this.setState({
                    code1_field_error: false,
                    code1_field_valid: false,
                })
            }
        }
    }

    changeSecondCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code2:  value
            })

            if (value.length == 1) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: true,
                })
                this.refs.thirdInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code2_field_error: false,
                    code2_field_valid: false,
                })
                this.refs.firstInput.focus();
            }
        }
    }

    changeThirdCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code3:  value
            })

            if (value.length == 1) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: true,
                })
                this.refs.fourthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code3_field_error: false,
                    code3_field_valid: false,
                })
                this.refs.secondInput.focus();
            }
        }
    }

    changeFourthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code4:  value
            })

            if (value.length == 1) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: true,
                })
                this.refs.fifthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code4_field_error: false,
                    code4_field_valid: false,
                })
                this.refs.thirdInput.focus();
            }
        }
    }
    changeFifthCodeInput =  (value) => {
        if (value.length < 2) {

            this.setState({
                code5:  value
            })

            if (value.length == 1) {
                this.setState({
                    code5_field_error: false,
                    code5_field_valid: true,
                })
                // this.refs.fifthInput.focus();
            }

            if (value.length == 0) {
                this.setState({
                    code5_field_error: false,
                    code5_field_valid: false,
                })
                this.refs.fourthInput.focus();
            }
        }
    }



    componentDidMount() {
        const { navigation } = this.props;
        this.getFooterInfo();
        this.focusListener = navigation.addListener("focus", () => {
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



    redirectToLogin = () => {
        this.setState({

            name_error: false,
            name_error_text: '',

            email_error: false,
            email_error_text: '',

            phone_error: false,
            phone_error_text: '',

            password_error: false,
            password_error_text: '',

            passwordConfirmation_error: false,
            passwordConfirmation_error_text: '',
            valid_email: false,
            valid_email_error_text: '',

        })
        this.props.navigation.navigate("Login");

    }



     registerHandler = () => {
        let {name, email, phone, password, passwordConfirmation} = this.state;

        if (name.length == 0 || email.length == 0 || phone.length == 0 || password.length == 0 || passwordConfirmation.length == 0) {
              if (name.length == 0) {
                  this.setState({
                      name_error: true,
                      name_error_text: 'El campo es obligatorio'
                  })
              } else {
                  this.setState({
                      name_error: false,
                      name_error_text: '',
                  })
              }
            if (email.length == 0) {
                this.setState({
                    email_error: true,
                    email_error_text:  'El campo es obligatorio'
                })
            } else {
                this.setState({
                    email_error: false,
                    email_error_text: '',
                })
            }
            if (phone.length == 0) {
                this.setState({
                    phone_error: true,
                    phone_error_text: 'El campo es obligatorio'
                })
            } else {
                this.setState({
                    phone_error: false,
                    phone_error_text: '',
                })
            }
            if (password.length == 0) {
                this.setState({
                    password_error: true,
                    password_error_text: 'El campo es obligatorio'
                })
            } else {
                this.setState({
                    password_error: false,
                    password_error_text: '',
                })
            }
            if (passwordConfirmation.length == 0) {
                this.setState({
                    passwordConfirmation_error: true,
                    passwordConfirmation_error_text: 'El campo es obligatorio'
                })
            } else {
                this.setState({
                    passwordConfirmation_error: false,
                    passwordConfirmation_error_text: '',
                })
            }
        }  else {
            this.setState({
                name_error: false,
                name_error_text: '',
                email_error: false,
                email_error_text: '',
                phone_error: false,
                phone_error_text: '',
                password_error: false,
                password_error_text: '',
                passwordConfirmation_error: false,
                passwordConfirmation_error_text: '',
            })

            try {
                fetch(`https://appbonus.justcode.am/api/register`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        password: password,
                        password_confirmation: passwordConfirmation,
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, 'register')

                    if (response.hasOwnProperty('password')) {
                           if (response.password == 'The password must be at least 6 characters.') {
                                this.setState({
                                    password_error: true,
                                    password_error_text: 'La contraseña debe tener al menos 6 caracteres.'
                                })
                           } else {
                               this.setState({
                                   password_error: false,
                                   password_error_text: ''
                               })
                           }
                    }

                    if (response.hasOwnProperty('password_confirmation')) {
                        if (response.password_confirmation == 'The password confirmation and password must match.') {
                            this.setState({
                                passwordConfirmation_error: true,
                                passwordConfirmation_error_text: 'La confirmación de la contraseña y la contraseña deben coincidir.'
                            })
                        } else {
                            this.setState({
                                passwordConfirmation_error: false,
                                passwordConfirmation_error_text: ''
                            })
                        }
                    }

                    if (response.hasOwnProperty('email')) {
                        if (response.email == 'The email must be a valid email address.') {
                            this.setState({
                                valid_email_error: true,
                                valid_email_error_text: 'El correo electrónico debe ser una dirección de correo electrónico válida.'
                            })
                        } else {
                            this.setState({
                                valid_email_error: false,
                                valid_email_error_text: ''
                            })
                        }
                    }

                    if (response.status === true) {
                         if (response.hasOwnProperty('message')) {
                             if (response.message == 'user created') {
                                 this.setState({
                                     confirm_email_code_popup: true,
                                     token: response.token
                                 })
                             }

                             if (response.message == 'no verify user') {
                                 this.setState({
                                     confirm_email_code_popup: true,
                                     token: response.token
                                 })
                             }
                         }


                    } else {
                        if (response.message == 'user Alredi exist') {
                            this.setState({
                                email_error: true,
                                email_error_text: 'La usuario Alredi existe',
                            })

                        } else {
                            this.setState({
                                email_error: false,
                                email_error_text: '',
                            })
                        }
                    }


                })
            } catch (e) {
                console.log(e)
            }
        }



     }


    getCode = () => {
        let codes = this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4 + this.state.code5;
        return codes;
    }
    verifyRegister =  () => {
        let userToken = this.state.token;
        let AuthStr = 'Bearer ' + userToken;
        let {code1, code2, code3, code4, code5} = this.state;

        if (code1.length == 0 || code2.length == 0 || code3.length == 0 || code4.length == 0 || code5.length == 0) {
            this.setState({
                phone_code_error: true,
                phone_code_error_text: 'El campo con el código de teléfono es obligatorio.',
            })
        } else {
            this.setState({
                phone_code_error: false,
                phone_code_error_text: '',
            })

            try {
                fetch(`https://appbonus.justcode.am/api/VerifyRegister`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: parseInt(this.getCode()),
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, 'confirm code')


                    if (response.hasOwnProperty('message')) {
                        if (response.message == 'wrong code') {
                             this.setState({
                                 phone_code_error: true,
                                 phone_code_error_text: 'El codigo esta mal',
                             })
                        } else {
                            this.setState({
                                phone_code_error: false,
                                phone_code_error_text: '',
                            })
                        }

                        if (response.message == 'code true') {
                            this.setState({
                                phone_code_error: false,
                                phone_code_error_text: '',
                                confirm_email_code_popup: false,
                                confirm_email_success_popup: true,
                            })
                        }
                    }





                })
            } catch (e) {
                console.log(e)
            }
        }
    }
    sendNewCode =  () => {
        let userToken = this.state.token;
        let AuthStr = 'Bearer ' + userToken;


            try {
                fetch(`https://appbonus.justcode.am/api/SendNewCode`, {
                    method: 'POST',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, 'confirm code')

                    if (response.status === true) {
                          if (response.hasOwnProperty('message')) {
                              if (response.message == 'code send your email') {
                                  this.setState ({
                                      phone_code_error: false,
                                      phone_code_error_text: '',
                                      code_send: true,
                                      code_send_text: 'Codigo envia tu email'
                                  })
                              }
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
                    <TouchableOpacity style={styles.back_to_login}  onPress={() => this.redirectToLogin()}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={35}
                            height={35}
                            viewBox="0 0 35 35"
                            fill="none"
                        >
                            <Path
                                d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                fill="#4D5DFA"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <View style={styles.header_img_box}>
                        <Image style={styles.header_child_img} source={require('../../assets/images/logo2.png')}/>
                    </View>




                </View>


                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                        // enableAutoAutomaticScrol='true'
                        // scrollEnabled={true}
                        // keyboardOpeningTime={0}
                        contentContainerStyle={{flexGrow: 1}}
                        style={styles.login_wrapper}>





                        <View style={styles.login_input_field_wrapper}>

                            {this.state.name_error &&
                            <Text style={styles.error_text}>{this.state.name_error_text}</Text>
                            }
                            <TextInput
                                style={styles.login_input_field}
                                onChangeText={(val) => this.setState({name: val})}
                                value={this.state.name}
                                placeholder='Nombre'
                                placeholderTextColor='#A6A6A6'
                            />


                        </View>





                        <View style={styles.login_input_field_wrapper}>
                            {this.state.email_error &&
                            <Text style={styles.error_text}>{this.state.email_error_text}</Text>
                            }

                            {this.state.valid_email_error &&
                            <Text style={styles.error_text}>{this.state.valid_email_error_text}</Text>
                            }
                            <TextInput
                                style={styles.login_input_field}
                                onChangeText={(val) => this.setState({email: val})}
                                value={this.state.email}
                                placeholder='E-mail'
                                placeholderTextColor='#A6A6A6'

                            />


                        </View>

                        <View style={styles.login_input_field_wrapper}>
                            {this.state.phone_error &&
                            <Text style={styles.error_text}>{this.state.phone_error_text}</Text>
                            }
                            <TextInput
                                style={styles.login_input_field}
                                onChangeText={(val) => this.setState({phone: val})}
                                value={this.state.phone}
                                placeholder='Teléfono'
                                placeholderTextColor='#A6A6A6'

                            />



                        </View>




                        <View style={styles.login_input_field_wrapper}>
                            {this.state.password_error &&
                            <Text style={styles.error_text}>{this.state.password_error_text}</Text>
                            }

                            <TextInput
                                style={styles.login_input_field}
                                onChangeText={(val) => this.setState({password: val})}
                                value={this.state.password}
                                placeholder='Contraseña'
                                placeholderTextColor='#A6A6A6'
                                secureTextEntry={true}
                            />

                        </View>

                        <View style={styles.login_input_field_wrapper}>

                            {this.state.passwordConfirmation_error &&
                            <Text style={styles.error_text}>
                                {this.state.passwordConfirmation_error_text}
                            </Text>
                            }
                            <TextInput
                                style={[styles.login_input_field]}
                                onChangeText={(val) => this.setState({passwordConfirmation: val})}
                                value={this.state.passwordConfirmation}
                                placeholder='Confirmar contraseña'
                                placeholderTextColor='#A6A6A6'
                                secureTextEntry={true}
                            />


                        </View>

                        <View style={styles.register_btn_box}>
                            <TouchableOpacity style={styles.register_btn} onPress={() => this.registerHandler()}>
                                <Text style={styles.register_btn_text}>Enviar</Text>
                            </TouchableOpacity>
                        </View>


                    </KeyboardAwareScrollView>




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



                {/*<TouchableOpacity style={styles.login_btn} onPress={() => this.redirectToLogin()}>*/}
                    {/*    <Text style={styles.login_btn_text}>login</Text>*/}
                    {/*</TouchableOpacity>*/}


                {this.state.confirm_email_code_popup &&
                  <View style={styles.recovery_password_phone_code_popup}>
                    <View style={styles.recovery_password_phone_code_popup_wrapper}>
                        <View style={styles.recovery_account_header}>
                            <View style={styles.back_to_sign_in_btn_wrapper}>

                                <TouchableOpacity style={styles.back_to_login}  onPress={() => this.setState({confirm_email_code_popup: false})}>
                                    <Svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 35 35" fill="none">
                                        <Path d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z" fill="#4D5DFA"/>
                                    </Svg>
                                </TouchableOpacity>

                                <View style={styles.header_child_img_box}>
                                    <Image style={styles.header_child_img} source={require('../../assets/images/logo2.png')}/>
                                </View>

                            </View>
                            <Text style={styles.recovery_account_email_main_title}>
                                Recuperación clave
                            </Text>
                        </View>
                        <ScrollView style={styles.recovery_account_code_main_wrapper}>


                            <Text style={styles.recovery_account_email_second_title}>
                                Le enviaremos un código de 6 dígitos a su correo electrónico. correo
                                para verificar la identidad
                            </Text>




                            <View style={styles.recovery_account_code_inputs_wrapper}>
                                <TextInput
                                    ref='firstInput'
                                    style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code1_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                    onChangeText={(value) => {this.changeFirstCodeInput(value)}}
                                    value={this.state.code1}
                                    placeholderTextColor="#000000"
                                    keyboardType="numeric"

                                />
                                <TextInput
                                    ref='secondInput'
                                    style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code2_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                    onChangeText={(value) => {this.changeSecondCodeInput(value)}}

                                    value={this.state.code2}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    ref='thirdInput'
                                    style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code3_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                    onChangeText={(value) => {this.changeThirdCodeInput(value)}}
                                    value={this.state.code3}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    ref='fourthInput'
                                    style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code4_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                    onChangeText={(value) => {this.changeFourthCodeInput(value)}}
                                    value={this.state.code4}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    ref='fifthInput'
                                    style={[styles.code_input_field,  {borderWidth: 1, borderColor:this.state.code5_field_error ? "#A4223C" :  "#F1F1F1"} ]}
                                    onChangeText={(value) => {this.changeFifthCodeInput(value)}}
                                    value={this.state.code5}
                                    keyboardType="numeric"
                                />

                            </View>
                            <View style={styles.send_code_again_btn_wrapper}>
                                <TouchableOpacity style={styles.send_code_again_btn} onPress={() => this.sendNewCode()}>
                                    <Text style={styles.send_code_again_btn_text}>
                                        Enviar Código De nuevo</Text>
                                </TouchableOpacity>

                                {this.state.code_send &&
                                <Text style={[styles.error_text, {textAlign: 'center'}]}>{this.state.code_send_text}</Text>
                                }

                                {this.state.phone_code_error &&

                                <Text style={[styles.error_text, {textAlign: 'center'}]}>
                                    {this.state.phone_code_error_text}
                                </Text>

                                }
                            </View>



                            <View style={styles.recovery_account_confirm_code_btn_wrapper}>
                                <TouchableOpacity style={styles.recovery_account_confirm_code_btn} onPress={() => this.verifyRegister()}>
                                    <Text style={styles.recovery_account_confirm_code_btn_text}>
                                        Confirmar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                }


                {this.state.confirm_email_success_popup &&
                    <View style={styles.successPasswordPopup}>
                    <View style={styles.successPasswordPopup_wrapper}>

                        <View style={styles.recovery_account_header}>
                            <View style={styles.back_to_sign_in_btn_wrapper}>
                                <TouchableOpacity style={styles.back_to_login}  onPress={() => this.setState({confirm_email_success_popup: false})}>
                                    <Svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={35}
                                        height={35}
                                        viewBox="0 0 35 35"
                                        fill="none"
                                    >
                                        <Path
                                            d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                            fill="#4D5DFA"
                                        />
                                    </Svg>
                                </TouchableOpacity>
                                <View style={styles.header_child_img_box}>
                                    {/*<Image style={styles.header_child_img} source={require('../../assets/images/logo.png')}/>*/}
                                    <Image style={styles.header_child_img} source={require('../../assets/images/logo2.png')}/>
                                </View>
                            </View>
                        </View>
                        <ScrollView style={styles.successPasswordPopup_scroll}>
                            <Text  style={styles.successPasswordPopup_title}>
                                Su contraseña ha sido cambiada exitosamente
                            </Text>
                            <TouchableOpacity style={styles.successPasswordPopup_sign_in_btn} onPress={() => {this.redirectToLogin()}}>
                                <Text style={styles.successPasswordPopup_sign_in_btn_text}>Entrar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
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
        paddingTop: 20,
        // paddingBottom: 29,


    },

    header: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
   },
    back_to_login: {
      position: 'absolute',
      left: 20,
      top: 20,
    },

    header_img_box: {
        width: '100%',
        maxWidth: 256,
        height: 227,
    },
    header_child_img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    login_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 66,
        paddingTop: 10,
        // paddingBottom: 30,
        marginBottom: 20

    },

    login_input_field_wrapper: {
        width: '100%',
        marginBottom: 16,
        position:'relative'
    },
    login_input_field: {
        width: '100%',
        borderRadius: 7,
        backgroundColor: '#F4F4F4',
        height: 50,
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#A6A6A6',
        fontWeight: '400',
    },
    login_btn: {
        width: '100%',
        borderRadius: 7,
        backgroundColor: '#4D5DFA',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },
    login_btn_text: {
        fontSize: 21,
        color: '#ffffff',
        fontWeight: '400',
    },

    register_btn: {
        width: '100%',
        marginBottom: 10,
        borderRadius: 7,
        backgroundColor: '#4D5DFA',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },
    register_btn_text: {
        fontSize: 21,
        color: '#ffffff',
        fontWeight: '400',
    },


    recovery_password_phone_code_popup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
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
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    recovery_password_phone_code_popup_wrapper: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 50,
        // paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'relative',
        flex: 1,
    },
    recovery_account_header: {
        paddingHorizontal: 25,
        paddingTop: 20,
        width: '100%',
    },
    back_to_sign_in_btn_wrapper: {
        marginBottom: 5,
    },
    header_child_img_box: {
        width: '100%',
        maxWidth: 256,
        height: 227,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    recovery_account_email_main_title: {
        color: "#333333",
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        lineHeight: 36,
        textAlign: 'center',

    },
    recovery_account_code_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 25,

    },

    recovery_account_code_main_title: {
        color: "#333333",
        fontSize: 36,
        fontWeight: 'bold',
        lineHeight: 36,
        textAlign: "center",
    },

    recovery_account_code_second_title: {
        color: '#545454',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 48,
        marginRight: 35,
        lineHeight: 16,
    },

    recovery_account_email_second_title: {
        color: '#A6A6A6',
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 30,
        lineHeight: 16,
        textAlign: 'center'
    },

    recovery_account_code_inputs_wrapper: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
        width: 250,

    },
    send_code_again_btn_wrapper: {
        marginBottom: 36,
    },
    send_code_again_btn: {
        alignSelf: "center",
    },
    send_code_again_btn_text: {
        color: "#A6A6A6",
        fontSize: 16,
        fontWeight: '400',
        textDecorationLine: 'underline'
    },

    code_input_field: {
        maxWidth: 45,
        flex:1,
        height: 60,
        backgroundColor: '#F1F1F1',
        fontSize:15,
        color:'#000000',
        borderRadius:8,
        fontWeight: "bold",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",

    },
    recovery_account_confirm_code_btn: {
        backgroundColor: '#4D5DFA',
        borderRadius: 7,
        width: "100%",
        maxWidth: 265,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    recovery_account_confirm_code_btn_text: {
        color: '#ffffff',
        fontWeight:'400',
        fontSize: 21,
        lineHeight: 27,
    },
    successPasswordPopup: {
        backgroundColor:  'rgba(255, 255, 255, 0.25)',
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
    },
    successPasswordPopup_wrapper: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
        paddingTop: 50,
        paddingBottom: 168,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },


    successPasswordPopup_close_btn: {
        position: 'absolute',
        right: 20,
        top:60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,

    },
    successPasswordPopup_img_parent: {
        paddingTop: 70,
        marginBottom: 30,
        // width: 230,
        // height: 185,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    successPasswordPopup_img: {
        width: '100%',
    },
    successPasswordPopup_title: {
        marginBottom: 140,
        fontSize: 30,
        color: '#A6A6A6',
        fontWeight: '400',
        // paddingHorizontal: 30,
        textAlign: 'center',
    },
    successPasswordPopup_sign_in_btn: {
        backgroundColor: '#4D5DFA',
        borderRadius: 7,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    successPasswordPopup_sign_in_btn_text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight:'700',
    },
    successPasswordPopup_scroll: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 40,
    },
    error_text: {
        fontSize: 9,
        fontWeight: '500',
        color: 'red',
        marginBottom: 5
        // position: 'absolute',
        // bottom:  -20,
        // zIndex: 999
    },
    register_btn_box: {
        width: '100%',
        // paddingTop: 20,
        paddingHorizontal: 60,
        // marginTop: 52
        marginBottom: 100
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
