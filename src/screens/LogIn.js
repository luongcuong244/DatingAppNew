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
import InputForm from "../components/InputForm";
import AuthApi from "../api/Auth.api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import socketChat from '../socket/socket.config';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';

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

  onPressRightButton = async (address, addressType, passwordValue, reenterPasswordValue) => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      AuthApi.signIn({
        mobile: address,
        password: passwordValue,
        deviceId: uniqueId,
      }).then(async (res) => {
        if (res.data.accessToken) {
          AsyncStorage.setItem('user', JSON.stringify(res.data.userInfo));
          AsyncStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.userInfo.name) {
            this.props.navigation.navigate("TabsManager");
          } else {
            this.props.navigation.navigate("BasicInformation");
          }
          console.log('Login successfully');
          var deviceName = "Unknown";
          try {
            deviceName = await DeviceInfo.getDeviceName();
          } catch (error) {
            console.error('Failed to get device name:', error);
          }
          console.log('Device name:', deviceName);
          var address = "Unknown";
          await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          Geolocation.getCurrentPosition(
            async position => {
              try {
                console.log('Position:', position);
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=crMmofRW2lgZNiDMZtCUdYqHZfGZv1cVZ864e0CR`);
                const data = await response.json();
                address = data.results[0].formatted_address;
                console.log('Address:', address);
              } catch (error) {
                console.error('Failed to get address:', error);
              }
              socketChat.emit('registerSession', {
                userId: res.data.userInfo._id,
                deviceId: uniqueId,
                deviceName: deviceName,
                address: address,
              });
            },
            error => {
              console.log('Failed to get location:', error);
              socketChat.emit('registerSession', {
                userId: res.data.userInfo._id,
                deviceId: uniqueId,
                deviceName: deviceName,
                address: address,
              });
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
          );
        } else {
          Alert.alert("Something went wrong... Try later!")
        }
      }).catch(err => {
        Alert.alert(null, err.response.data.mes);
      });
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
            {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.onForgotPassword}
            >
              <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
            </TouchableOpacity> */}

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