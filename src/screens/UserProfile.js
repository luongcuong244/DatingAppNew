import React, { useState, useRef } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Text,
    ScrollView,
    Alert,
} from "react-native";

import { inforFiltering } from '../module/InforFiltering';
import ArrowIcon from '../../assets/vectors/arrow-left-ios.svg';
import MaleIcon from '../../assets/vectors/male-icon.svg';
import FemaleIcon from '../../assets/vectors/female-icon.svg';
import TransgenderIcon from '../../assets/vectors/transgender-icon.svg';
import UserApi from "../api/User.api";

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default function UserProfile({ navigation, onBack, route = { params: { likedMe, meLiked, isNavigate: false, userInfo: {}, onNavigateBack, showLikeButton: false, showBlockButton: false } } }) {
    const isMove = useRef(false);
    const [userInfor, setUserInfor] = useState(inforFiltering(route.params.userInfo));
    const [indexOfPhoto, setIndexOfPhoto] = useState(0);

    const getFirstName = (name) => {
        console.log("name: ", name);
        let arr = name.split(' ');
        return arr[arr.length - 1];
    }

    const transferPhoto = (touch_X) => {
        if (touch_X <= WIDTH_SCREEN / 2) {
            if (indexOfPhoto > 0) {
                setIndexOfPhoto(indexOfPhoto - 1);
            }
        } else {
            if (indexOfPhoto < (route.params.userInfo.listImages.length - 1) && route.params.userInfo.listImages[indexOfPhoto + 1]) {
                setIndexOfPhoto(indexOfPhoto + 1);
            }
        }

    }

    const Header = () => {

        const onGoBack = () => { navigation.goBack() }

        return (
            <View
                style={styles.headerContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.backButton}
                    onPress={route.params.isNavigate ? onGoBack : onBack}
                >
                    <ArrowIcon width={13} height={22.09} style={{ color: '#fff' }} />
                </TouchableOpacity>

                <View style={styles.headerTitleWrapper} >
                    <Text style={styles.headerTitle} >{`Hồ sơ của ${getFirstName(route.params.userInfo.name)}`}</Text>
                </View>
            </View>
        )
    }

    const PhotosUser = () => {

        const onTouchStart = (event) => {
            isMove.current = false;
        }

        const onTouchMove = () => {
            isMove.current = true;
        }

        const onTouchEnd = (event) => {
            let x = event.nativeEvent.locationX;
            if (isMove.current == false) {
                transferPhoto(x);
            }
        }

        return (
            <ImageBackground
                style={styles.photosUserContainer}
                source={{ uri: route.params.userInfo.listImages[indexOfPhoto] }}
            >
                <View
                    style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.0001)' }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                ></View>

                <View style={styles.transferPhotosStyle} >
                    {
                        route.params.userInfo.listImages.map((item, index) => {

                            if (!item) {
                                return;
                            }

                            return (
                                <View
                                    key={index}
                                    style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: indexOfPhoto === index ? 'white' : 'rgba(125,125,125, 0.8)',
                                        borderWidth: indexOfPhoto === index ? 0 : 1,
                                        borderColor: 'rgba(255,255,255, 0.8)',
                                        borderRadius: 6,
                                        marginHorizontal: 6,
                                    }}
                                ></View>
                            )
                        })
                    }
                </View>
            </ImageBackground>
        )
    }

    const BasicInfor = () => {

        let GenderIcon;

        switch (route.params.userInfo.gender) {
            case "Male", "Nam": {
                GenderIcon = MaleIcon;
                break;
            }

            case "Female", "Nữ": {
                GenderIcon = FemaleIcon;
                break;
            }

            case "Transgender", "LGBT": {
                GenderIcon = TransgenderIcon;
                break;
            }

            default: {
                GenderIcon = MaleIcon;
                break;
            }
        }

        return (
            <View style={styles.basicInforContainer} >
                <View>
                    <Text style={styles.nameAndAgeLabel} >{route.params.userInfo.name + ", " + route.params.userInfo.age}</Text>
                    <Text style={styles.addressLabel} >{route.params.userInfo.address}</Text>
                </View>

                <GenderIcon
                    width={50}    // một nửa chiều cao
                    height={50}
                />

            </View>
        )
    }

    const Introductory = () => {

        return (
            <View
                style={styles.inforWrapper}
            >
                <Text style={styles.textHeaderStyle} >Giới thiệu về tôi</Text>

                <View
                    style={[
                        styles.inforContentWrapper,
                        {
                            paddingHorizontal: 25,
                            paddingVertical: 15,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.styleOfValueText,
                            {
                                position: 'relative',
                                letterSpacing: 0.5,
                                color: 'rgba(255,255,255,0.5)'
                            },
                        ]}
                    >
                        {route.params.userInfo.introductory}
                    </Text>
                </View>
            </View>
        )
    }

    const MoreInfor = () => {
        return (
            <View
                style={styles.inforWrapper}
            >
                <Text style={styles.textHeaderStyle} >{`Thêm về ${route.params.userInfo.name}`}</Text>

                {
                    userInfor.map((item, index) => {

                        if (!item.value) return;

                        const Icon = item.icon;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.inforContentWrapper,
                                    {
                                        padding: 10,
                                        marginVertical: 5,
                                    }
                                ]}
                            >
                                <Icon width={22} height={22} style={{ color: '#FF8D3E' }} />
                                <Text style={styles.styleOfLabelText} >{item.title}</Text>

                                {
                                    item.key === 'hobbies' ? (
                                        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginHorizontal: 15 }} >
                                            {
                                                item.value.map((hobby, indexOfHobby) => {
                                                    return (
                                                        <View
                                                            key={indexOfHobby}
                                                            style={styles.hobbyItemContainer}
                                                        >
                                                            <Text style={styles.hobbyItemText}>
                                                                {hobby}
                                                            </Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    ) : (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                            <Text style={styles.styleOfValueText} >
                                                {((item.suffixes && item.value) ? (item.value + item.suffixes) : item.value)}
                                            </Text>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    const LikedMe = () => {

        const handleMatchAndChat = () => {
            UserApi.addToListLike({
                userIdToAdd: route.params.userInfo._id,
            })
                .then((response) => {
                    console.log("response: ", response.data);
                    let isMatched = response.data.data.listMatch.findIndex((id) => id == route.params.userInfo._id) > -1 ? true : false;
                    let roomId = response.data.roomId;
                    if (isMatched) {
                        route.params.onNavigateBack && route.params.onNavigateBack();
                        navigation.goBack();
                        navigation.navigate("MatchAndChat", {
                            listImages: route.params.userInfo.photos,
                            userId: route.params.userInfo._id,
                            roomId,
                        });
                    } else {
                        Alert.alert("Thông báo", "Đã thiết lập mối quan hệ thành công");
                    }
                })
                .catch((error) => {
                    console.log("error: ", error.response.data.mes);
                    Alert.alert("Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại sau!");
                });
        }

        const handleDelete = () => {

        }

        return (
            <View>
                <Text style={styles.likedMeLabel} >
                    {`${getFirstName(route.params.userInfo.name)} đã thích bạn`}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.likedMeButtonStyle,
                        {
                            backgroundColor: '#00ACB7',
                            borderColor: 'white',
                        }
                    ]}
                    onPress={handleMatchAndChat}
                >
                    <Text
                        style={{ fontSize: 17, fontWeight: '500', color: 'white', letterSpacing: 1 }}
                    >
                        Tương hợp ngay
                    </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.likedMeButtonStyle,
                        {
                            paddingHorizontal: 40,
                            backgroundColor: 'rgba(154,154,154,0.13)',
                            borderColor: '#9A9A9A',
                            marginTop: 20,
                        }
                    ]}
                    onPress={handleDelete}
                >
                    <Text
                        style={{ fontSize: 14, color: '#9A9A9A' }}
                    >
                        Xóa khỏi danh sách "Đã thích bạn"
                    </Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    const MeLiked = () => {
        const handleDelete = () => {
            UserApi.removeFromListLike(route.params.userInfo._id)
                .then(() => {
                    route.params.onNavigateBack && route.params.onNavigateBack();
                    navigation.goBack();
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Lỗi", "Xóa không thành công");
                })
        }

        return (
            <View>
                <Text style={styles.likedMeLabel} >
                    {`Bạn đã thích ${getFirstName(route.params.userInfo.name)}`}
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.likedMeButtonStyle,
                        {
                            paddingHorizontal: 40,
                            backgroundColor: 'rgba(154,154,154,0.13)',
                            borderColor: '#9A9A9A',
                            marginTop: 20,
                        }
                    ]}
                    onPress={handleDelete}
                >
                    <Text
                        style={{ fontSize: 14, color: '#9A9A9A' }}
                    >
                        Xóa khỏi danh sách "Bạn đã thích"
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View>
            <Header />

            <ScrollView contentContainerStyle={styles.screenStyle} >

                <PhotosUser />

                <BasicInfor />

                {
                    route.params.userInfo.introductory && (
                        <Introductory />
                    )
                }

                <MoreInfor />

                {
                    route.params.likedMe && (
                        <LikedMe />
                    )
                }
                {
                    route.params.meLiked && (
                        <MeLiked />
                    )
                }
                {
                    route.params.showLikeButton && (
                        <TouchableOpacity
                            onPress={() => {
                                UserApi.addToListLike({
                                    userIdToAdd: route.params.userInfo._id,
                                })
                                    .then((response) => {
                                        route.params.onNavigateBack && route.params.onNavigateBack();
                                        navigation.goBack();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        Alert.alert("Lỗi", "Thích không thành công");
                                    })
                            }}
                            activeOpacity={0.8}
                            style={[
                                styles.likedMeButtonStyle,
                                {
                                    paddingHorizontal: 40,
                                    backgroundColor: '#00ACB7',
                                    borderColor: 'white',
                                    marginTop: 20,
                                }
                            ]}
                        >
                            <Text
                                style={{ fontSize: 17, fontWeight: '500', color: 'white', letterSpacing: 1 }}
                            >
                                Thích
                            </Text>
                        </TouchableOpacity>
                    )
                }
                {
                    route.params.showBlockButton && (
                        <TouchableOpacity
                            onPress={() => {
                                // UserApi.addToListLike({
                                //     userIdToAdd: route.params.userInfo._id,
                                // })
                                //     .then((response) => {
                                //         route.params.onNavigateBack && route.params.onNavigateBack();
                                //         navigation.goBack();
                                //     })
                                //     .catch((err) => {
                                //         console.log(err);
                                //         Alert.alert("Lỗi", "Thích không thành công");
                                //     })
                            }}
                            activeOpacity={0.8}
                            style={[
                                styles.likedMeButtonStyle,
                                {
                                    paddingHorizontal: 40,
                                    backgroundColor: '#00ACB7',
                                    borderColor: 'white',
                                    marginTop: 20,
                                }
                            ]}
                        >
                            <Text
                                style={{ fontSize: 17, fontWeight: '500', color: 'white', letterSpacing: 1 }}
                            >
                                Chặn người này
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenStyle: {
        flexGrow: 1,
        backgroundColor: '#00444E',
        alignItems: 'center',
        paddingBottom: 30,
    },
    headerContainer: {
        backgroundColor: 'rgba(50,75,76,0.7)',
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
    photosUserContainer: {
        width: '100%',
        height: WIDTH_SCREEN * 3 / 2,
        backgroundColor: 'rgb(0,131,146)',
        alignItems: 'center',
        justifyContent: "flex-end",
    },
    transferPhotosStyle: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    basicInforContainer: {
        width: WIDTH_SCREEN - 30,
        backgroundColor: 'rgba(0,131,146,0.7)',
        margin: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
    },
    nameAndAgeLabel: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    addressLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.5)',
    },
    inforWrapper: {
        width: '100%',
        marginTop: 20,
    },
    textHeaderStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#077D7D',
        marginBottom: 5,
        marginLeft: 25,
    },
    inforContentWrapper: {
        backgroundColor: '#002E34',
        borderRadius: 7,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styleOfLabelText: {
        color: '#C9C9C9',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 8,
    },
    styleOfValueText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    hobbyItemContainer: {
        paddingVertical: 4,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: 'white',
    },
    hobbyItemText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
        letterSpacing: 0.5
    },
    likedMeLabel: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        color: 'rgba(120,138,136,0.6)',
        marginTop: 30,
        marginBottom: 20,
    },
    likedMeButtonStyle: {
        borderRadius: 100,
        paddingHorizontal: 7,
        paddingVertical: 7,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})