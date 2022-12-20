import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();



import {AuthContext} from "./components/AuthContext/context";
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import RegisterComponent from './components/auth/registration';
import LoginComponent from './components/auth/login';
import UserComponent from './components/profile/user';
import ManagerComponent from './components/profile/manager';
import QrScannerComponent from './components/profile/qr_scaner';
import RecoveryPasswordComponent from './components/auth/recovery_password';





function RegisterScreen({ navigation }) {
  return (
      <RegisterComponent navigation={navigation}  />
  );
}

function LoginScreen({ navigation }) {
    return (
        <LoginComponent navigation={navigation}  />
    );
}

function UserScreen({ navigation }) {
  return (
      <UserComponent navigation={navigation}  />
  );
}
function ManagerScreen({ navigation }) {
  return (
      <ManagerComponent navigation={navigation}  />
  );
}

function QrScannerScreen({  navigation }) {
    return (
        <QrScannerComponent  navigation={navigation}  />
    );
}

function RecoveryPasswordScreen({  navigation }) {
    return (
        <RecoveryPasswordComponent  navigation={navigation}  />
    );
}





export default function App() {
    const popAction = StackActions.pop(1);

    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState(null);

    const initialLoginState = {
        isLoading: true,
        userToken: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser, callback) => {
            // setIsLoading(true);
            const userToken = String(foundUser.userToken);
            const userData = foundUser.userData;
            // const userEmail = foundUser.email;
            // const userId = String(foundUser.user_id);
            // setUserToken(userToken);

            //  console.log('AuthUser', foundUser);
            try {
                await AsyncStorage.setItem('userToken', userToken);
                await AsyncStorage.setItem('userData', userData);
                // await AsyncStorage.setItem('userId', userId);
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGIN',  token: userToken});
            callback();
        },
        signOut: async (callback) => {
            try {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userData');
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGOUT'});
            callback();
        },
        signUp: () => {
            // setIsLoading(false);
        }
    }), []);


    // Проверка при входе в приложение.

    React.useEffect(() => {
        setTimeout(async () => {
            // await AsyncStorage.removeItem('userToken', userToken);

            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
        }, 1000);
    }, []);
    return (


        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {loginState.userToken !== null ?
                    (
                        <Stack.Navigator
                            initialRouteName='User'
                            screenOptions={{
                                headerShown: false
                            }}

                        >


                            <Stack.Screen name="User" component={UserScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />
                            <Stack.Screen name="Manager" component={ManagerScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="QrScanner" component={QrScannerScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                        </Stack.Navigator>
                    )
                    :


                    <Stack.Navigator
                        initialRouteName='Login'
                        screenOptions={{
                            headerShown: false
                        }}

                    >



                        <Stack.Screen name="Login" component={LoginScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="Register" component={RegisterScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />




                        <Stack.Screen name="RecoveryPassword" component={RecoveryPasswordScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />



                    </Stack.Navigator>
                }
            </NavigationContainer>
        </AuthContext.Provider>



    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },



});
