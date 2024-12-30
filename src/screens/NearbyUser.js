import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import UserApi from '../api/User.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

MapLibreGL.setAccessToken(null); // Goong sử dụng API Key riêng
MapLibreGL.setConnected(true);

const data = [
    {
        avatar:
            'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau.jpeg',
        latitude: 20.980216,
        longitude: 105.772607,
        age: 25,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9811,
        longitude: 105.7732,
        age: 30,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9798,
        longitude: 105.7715,
        age: 22,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9805,
        longitude: 105.773,
        age: 28,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9795,
        longitude: 105.7722,
        age: 35,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9813,
        longitude: 105.7728,
        age: 27,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9808,
        longitude: 105.7719,
        age: 21,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9797,
        longitude: 105.7731,
        age: 24,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.981,
        longitude: 105.7724,
        age: 29,
    },
    {
        avatar:
            'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-n...50.jpg',
        latitude: 20.9803,
        longitude: 105.7735,
        age: 26,
    },
];

const loadMap =
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=V0HS8KfYmnE7ZT2vA1ONH00H7NqKOTm7vu46U4cq';

const NearbyUser = (props) => {
    const cameraRef = useRef(null);
    const mapRef = useRef(null);

    const [centerCoords, setCenterCoords] = useState();
    const [locations, setLocations] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(17);
    const [isMapReady, setIsMapReady] = useState(false);

    const fetchLocationCurrent = async () => {
        await Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log({ latitude, longitude });
                setCenterCoords({ latitude, longitude });
                // setStartCoords({latitude, longitude});
                cameraRef.current?.setCamera({
                    centerCoordinate: [longitude, latitude],
                    zoomLevel: 17,
                    animationDuration: 1000,
                });
                UserApi.getUserNearby(
                    {
                        latitude,
                        longitude,
                    }
                )
                    .then(res => {
                        setLocations(res.data);
                        console.log(res.data);
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
    };

    const handleRegionChange = e => {
        const { geometry, properties } = e;
        setZoomLevel(properties.zoomLevel);
        setCenterCoords({
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
        });
    };

    const handleMapPress = (event) => {
        const { geometry } = event;
        const { coordinates } = geometry; // Tọa độ [longitude, latitude]
        console.log('Tọa độ:', coordinates);
    };

    useFocusEffect(
        useCallback(() => {
            console.log('Focus');
            fetchLocationCurrent();
        }, []),
    );

    return (
        <View style={{ flex: 1 }}>
            {centerCoords && (
                <MapLibreGL.MapView
                    styleURL={loadMap}
                    onPress={handleMapPress}
                    style={{ flex: 1 }}
                    compassEnabled={true}
                    ref={mapRef}
                    onDidFinishRenderingMapFully={() => setIsMapReady(true)}
                    onRegionDidChange={e => handleRegionChange(e)}
                    zoomEnabled={true}>
                    <MapLibreGL.Camera
                        ref={cameraRef}
                        animationDuration={100}
                        centerCoordinate={[centerCoords.longitude, centerCoords.latitude]}
                        zoomLevel={zoomLevel}
                    />
                    <MapLibreGL.UserLocation visible={true} />
                    {isMapReady &&
                        locations.map((item, index) => (
                            <View key={`@@${index}`} style={{ pointerEvents: 'box-none' }}>
                                {item.longitude && item.latitude && (
                                    <MapLibreGL.PointAnnotation
                                        id={`marker-${index}`}
                                        coordinate={[item.longitude, item.latitude]} // Tọa độ marker
                                        onSelected={() => {
                                            AsyncStorage.getItem("user")
                                                .then((user) => {
                                                    let likedMe = item.userInfo.listLike.includes(JSON.parse(user)._id);
                                                    let meLiked = JSON.parse(user).listLike.includes(item.userInfo._id);
                                                    let showLikeButton = !likedMe && !meLiked;
                                                    props.navigation.navigate('UserProfile', {
                                                        isNavigate: true,
                                                        likedMe: likedMe,
                                                        meLiked: meLiked,
                                                        showLikeButton: showLikeButton,
                                                        userInfo: {
                                                            ...item.userInfo,
                                                            listImages: item.userInfo.photos,
                                                            age: new Date().getFullYear() - new Date(item.userInfo.dateOfBirth).getFullYear(),
                                                        },
                                                        onNavigateBack: () => {
                                                            fetchLocationCurrent();
                                                        }
                                                    });
                                                });
                                        }}
                                    >
                                        {/* Custom marker (tuỳ chỉnh biểu tượng marker) */}
                                        <View
                                            style={{
                                                // backgroundColor: '#6633FF',
                                                width: 40,
                                                height: 40,
                                                borderRadius: 100,
                                                borderWidth: 2,
                                                borderColor: '#003300',
                                                shadowColor: '#000', // Màu của bóng
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 4, // Hướng của bóng
                                                },
                                                overflow: 'hidden',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                shadowOpacity: 0.3, // Độ mờ của bóng
                                                shadowRadius: 4, // Độ lan của bóng
                                                elevation: 6,
                                            }}>
                                            <View
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <Image
                                                    source={{
                                                        uri: item.photo,
                                                    }}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        resizeMode: 'cover',
                                                        borderRadius: 20,
                                                    }}
                                                // onLoad={() => console.log('Image loaded')}
                                                />
                                            </View>
                                            {/* <View style={{height: 20, width: 20}}> */}
                                            {/* <Text>a</Text> */}
                                            {/* </View> */}
                                        </View>
                                    </MapLibreGL.PointAnnotation>
                                )}
                            </View>
                        ))}
                </MapLibreGL.MapView>
            )}
        </View>
    );
};

export default NearbyUser;