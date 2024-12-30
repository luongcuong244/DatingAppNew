import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert
} from "react-native";
import Text from '../components/AppText';
import InputForm from "../components/InputForm";
import AuthApi from "../api/Auth.api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HEIGHT_SCREEN = Dimensions.get("window").height;

export default class LogIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addrestToLogin: "",
      password: "",
    }
  }

  onForgotPassword = () => {
    this.props.navigation.navigate("EnterAddress");
  }

  onPressRightButton = (address, addressType, passwordValue, reenterPasswordValue) => {
    AuthApi.signIn({
      mobile: address,
      password: passwordValue
    }).then((res) => {
      if (res.data.accessToken) {
        AsyncStorage.setItem('user', JSON.stringify(res.data.userInfo));
        AsyncStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.userInfo.name) {
          this.props.navigation.navigate("TabsManager");
        } else {
          this.props.navigation.navigate("BasicInformation");
        }
      } else {
        Alert.alert("Something went wrong... Try later!")
      }
    }).catch(err => {
      Alert.alert(null, err.response.data.mes);
    });
  }

  onPressLeftButton = () => {
    this.props.navigation.navigate("LogUp");
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={{
            transform: [
              {
                scale: 1.1,
              }
            ]
          }}
          source={require('../../assets/imgs/background.jpg')}
        >
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={20}
            style={{ flex: 1, alignItems: 'center', flexDirection: 'column-reverse', marginBottom: 30, justifyContent: 'center' }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.onForgotPassword}
            >
              <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
            </TouchableOpacity>

            <InputForm
              leftButtonLabel={"Đăng ký"}
              rightButtonLabel={"Tiếp tục"}
              placeholderAddressInput={"Số điện thoại hoặc email"}
              placeholderPasswordInput={"Nhập mật khẩu của bạn"}
              onPressRightButton={this.onPressRightButton}
              onPressLeftButton={this.onPressLeftButton}
            />

          </KeyboardAvoidingView>
        </ImageBackground >
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    height: HEIGHT_SCREEN,
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 25,
  },
  socialNetworkButton: {
    width: '85%',
    height: 40,
    marginVertical: "2%",
  },
  socialNetworkLinear: {
    flex: 1,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 35,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialNetworkText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    marginLeft: "5%",
  },
  forgotPassword: {
    marginBottom: 30,
    fontStyle: "italic",
    fontSize: 18,
    color: "rgba(149,176,177,0.7)",
    textDecorationLine: "underline"
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    width: '85%',
    height: 40,
  },
  buttonStyle: {
    height: '100%',
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#95D1D3',
    borderRadius: 100,
    borderWidth: 2,
  },
  textInputContainer: {
    height: 50,
    width: '85%',
    borderRadius: 10,
    borderColor: "#005C6E",
    borderWidth: 1,
    backgroundColor: 'rgba(149,176,177,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },
  inputStyle: {
    fontSize: 17,
    color: '#324B4C',
    flex: 1,
    marginLeft: 10,
  }
})