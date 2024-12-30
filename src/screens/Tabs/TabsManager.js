import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../../components/Header';
import CardSwipeTab from './CardSwipeTab';
import FavouriteTab from './FavouriteTab';
import HomeTab from './HomeTab';
import ChatsTab from './ChatsTab';
import UserTab from './UserTab';
import CustomTabs from '../../components/CustomTabs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import UserApi from '../../api/User.api';
import Geolocation from '@react-native-community/geolocation';
import NearbyUser from '../NearbyUser';

const Tab = createBottomTabNavigator();

export default function TabsManager(props) {

    useEffect(() => {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then(async result => {
                if (result === RESULTS.GRANTED) {
                    console.log('Location permission granted');
                    await Geolocation.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            UserApi.updateLocation({ latitude, longitude })
                                .then(res => {
                                    console.log("Update location successfully");
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        },
                        error => {
                            console.error(error);
                        },
                        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
                    );
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#324B4C' }} >
            <Header {...props} />
            <Tab.Navigator
                initialRouteName='CardSwipeTab'
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                }}
                tabBar={(props) => <CustomTabs {...props} />}
            >
                <Tab.Screen
                    name="CardSwipeTab"
                    component={CardSwipeTab}
                />
                <Tab.Screen
                    name="FavouriteTab"
                    component={FavouriteTab}
                    options={{
                        title: "FavouriteTab",
                        unmountOnBlur: true,
                    }}
                />
                <Tab.Screen
                    name="HomeTab"
                    component={NearbyUser}
                />
                <Tab.Screen
                    name="ChatsTab"
                    component={ChatsTab}
                />
                <Tab.Screen
                    name="UserTab"
                    component={UserTab}
                />
            </Tab.Navigator>
        </View>
    )
}