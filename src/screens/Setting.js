import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Switch
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ArrowIcon from '../../assets/vectors/arrow-left-ios.svg';
import { NativeModules, NativeEventEmitter } from 'react-native';

export default function Setting(props) {

    const Header = () => {
        return (
            <View
                style={styles.headerContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.backButton}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <ArrowIcon width={13} height={22.09} style={{ color: '#fff' }} />
                </TouchableOpacity>

                <View style={styles.headerTitleWrapper} >
                    <Text style={styles.headerTitle} >Cài đặt</Text>
                </View>
            </View>
        )
    }

    const NotificationSetting = () => {

        const [isSomeoneLikedEnabled, setIsSomeoneLikedEnabled] = useState(false);

        const toggleSomeoneLikedSwitch = () => {
            const { MyNativeModule } = NativeModules;
            MyNativeModule.setSecurity(!isSomeoneLikedEnabled);
            setIsSomeoneLikedEnabled(!isSomeoneLikedEnabled);
        };

        useEffect(() => {
            const { MyNativeModule } = NativeModules;
            setIsSomeoneLikedEnabled(MyNativeModule.getSecurity());
        }, []);

        return (
            <View style={styles.areasStyle} >
                <Text style={styles.areaTitle} >Bảo mật</Text>

                <View style={styles.areaRowStyle} >
                    <Text style={styles.areaRowLabel} >Yêu cầu xác thực khi quay lại ứng dụng</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#1BDF4A" }}
                        thumbColor={isSomeoneLikedEnabled ? "white" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSomeoneLikedSwitch}
                        value={isSomeoneLikedEnabled}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.screenStyle} >
            <Header />

            <ScrollView contentContainerStyle={{ marginTop: 45, flexGrow: 1 }} >
                <NotificationSetting />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenStyle: {
        flex: 1,
        backgroundColor: '#00444E',
    },
    headerContainer: {
        backgroundColor: '#324B4C',
        width: '100%',
        height: 45,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    backButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    headerTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
    },
    areasStyle: {
        width: '100%',
        marginVertical: 20,
    },
    areaTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2AC0BB',
        marginBottom: 15,
        marginLeft: 20,
    },
    areaRowStyle: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 5,
    },
    areaRowLabel: {
        fontSize: 15,
        color: 'white',
    }
})