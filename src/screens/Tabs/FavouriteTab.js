import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
} from 'react-native';

import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolateColor,
    withTiming,
} from 'react-native-reanimated';

import {
    TapGestureHandler
} from 'react-native-gesture-handler';

import { CircleSnail } from 'react-native-progress';

import FilterIcon from '../../../assets/vectors/filter-icon.svg';
import Filter from '../../components/Filter';
import LikedIcon from '../../../assets/vectors/liked.svg';
import BeLikedIcon from '../../../assets/vectors/favourite.svg';

import SmallCard from '../../components/SmallCard';
import UserApi from '../../api/User.api';
import { useFocusEffect } from '@react-navigation/native';

export default function FavouriteTab(props) {

    const animDuration = useRef(300).current;
    //const refList = useRef();

    const [data, setData] = useState();
    const [optionSelecting, setOptionSelecting] = useState("beLiked");
    const [headerTitle, setHeaderTitle] = useState();
    const [showFilter, setShowFilter] = useState(false);
    const [widthFlatList, setWidthFlatList] = useState(0);
    const [isScroll, setIsScroll] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const beLikedOption_BackgroundColor = useSharedValue(0);
    const beLikedOption_BorderRadius = useSharedValue(30);
    const beLikeOption_BorderWidth = useSharedValue(3);

    const likedOption_BackgroundColor = useSharedValue(1);
    const likedOption_BorderRadius = useSharedValue(10);
    const likeOption_BorderWidth = useSharedValue(0);

    const borderRadius = useSharedValue();

    const setShowFilterModal = (isShow) => {
        setShowFilter(isShow);
    }

    // useEffect(() => {
    //     loadDataFromServer('beLiked');
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            if (beLikeOption_BorderWidth.value == 0) {
                runOnJS(handleClickLiked)();
            } else {
                runOnJS(handleClickBeLiked)();
            }
        }, [])
    )

    const loadDataFromServer = (optionSelecting) => {
        setIsLoading(true);
        switch (optionSelecting) {
            case "liked": {
                setHeaderTitle("Tôi đã thích ( ? )");
                UserApi.getAllUserInListLike()
                    .then((res) => {
                        let data = res.data.data;
                        setHeaderTitle("Tôi đã thích ( " + data.length + " )");
                        setData(data);
                        setIsLoading(false);
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        Alert.alert("Error", "Something went wrong!");
                    });
                break;
            }
            case "beLiked": {
                setHeaderTitle("Đã thích tôi ( ? )");
                UserApi.getAllUserLikeMe()
                    .then((res) => {
                        let data = res.data.data;
                        setHeaderTitle("Đã thích tôi ( " + data.length + " )");
                        setData(data);
                        setIsLoading(false);
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        Alert.alert("Error", "Something went wrong!");
                    });
                break;
            }
        }
    }

    const handleClickBeLiked = () => {
        setData(null);
        setOptionSelecting('beLiked');
        loadDataFromServer('beLiked');
    }

    const onClickBeLiked = useAnimatedGestureHandler({
        onFinish: () => {

            beLikedOption_BackgroundColor.value = withTiming(0);
            beLikedOption_BorderRadius.value = withTiming(30);
            beLikeOption_BorderWidth.value = withTiming(3);

            likedOption_BackgroundColor.value = withTiming(1);
            likedOption_BorderRadius.value = withTiming(10);
            likeOption_BorderWidth.value = withTiming(0);

            runOnJS(handleClickBeLiked)();
        }
    });

    const handleClickLiked = () => {
        setData(null);
        setOptionSelecting('liked');
        loadDataFromServer('liked');
    }

    const onClickLiked = useAnimatedGestureHandler({
        onFinish: () => {

            likedOption_BackgroundColor.value = withTiming(0);
            likedOption_BorderRadius.value = withTiming(30);
            likeOption_BorderWidth.value = withTiming(3);

            beLikedOption_BackgroundColor.value = withTiming(1);
            beLikedOption_BorderRadius.value = withTiming(10);
            beLikeOption_BorderWidth.value = withTiming(0);

            runOnJS(handleClickLiked)();
        }
    });

    const uas_BeLiked = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(beLikedOption_BackgroundColor.value, [0, 1], ['#706DC3', '#40646A']),
            borderRadius: beLikedOption_BorderRadius.value,
            borderWidth: beLikeOption_BorderWidth.value,
        }
    });

    const uas_Liked = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(likedOption_BackgroundColor.value, [0, 1], ['#706DC3', '#40646A']),
            borderRadius: likedOption_BorderRadius.value,
            borderWidth: likeOption_BorderWidth.value,
        }
    });

    const onPressCard = async (cloneCard) => {
        props.navigation.navigate('UserProfile', {
            isNavigate: true,
            likedMe: optionSelecting == 'beLiked' ? true : false,
            meLiked: optionSelecting == 'liked' ? true : false,
            userInfo: cloneCard.userInfo,
            onNavigateBack: () => {
                loadDataFromServer(optionSelecting);
            }
        });
    }

    const onClickFilterIcon = () => {
        setShowFilterModal(true);
    }

    const onLayouFlatlist = (event) => {
        if (borderRadius.value == null) {
            borderRadius.value = 13 * (event.nativeEvent.layout.width / 2 - 30) / 130;
        }
        setWidthFlatList(event.nativeEvent.layout.width);
    }

    const onScrollBeginDrag = () => {
        setIsScroll(true);
    }

    const onScrollEndDrag = () => {
        setIsScroll(false);
    }

    const renderItem = (item) => {
        if (widthFlatList <= 0) {
            return null;
        }
        return (
            <SmallCard
                userInfo={item.item}
                //index={item.index}
                widthFlatList={widthFlatList}
                isScroll={isScroll}
                onPress={onPressCard}
            />
        )
    }

    return (
        <View style={styles.containerStyle} >
            <View style={styles.optionsWrapper} >

                <TapGestureHandler onGestureEvent={onClickBeLiked} >
                    <Animated.View
                        style={[
                            styles.optionsItem,
                            uas_BeLiked
                        ]}
                    >
                        <BeLikedIcon height={25} width={25} />
                    </Animated.View>
                </TapGestureHandler>

                <TapGestureHandler onGestureEvent={onClickLiked} >
                    <Animated.View
                        style={[
                            styles.optionsItem,
                            uas_Liked
                        ]}
                    >
                        <LikedIcon height={25} width={25} />
                    </Animated.View>
                </TapGestureHandler>
            </View>

            <View style={styles.contentContainer} >
                <View style={styles.headerContent} >
                    <Text style={styles.headerTitle} >{headerTitle}</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onClickFilterIcon}
                    >
                        <FilterIcon width={20.32} height={25.39} />
                    </TouchableOpacity>
                </View>

                {
                    isLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <CircleSnail
                                color={['white']}
                                size={40}
                                thickness={2}
                            />
                        </View>
                    ) : data.length > 0 ? (
                        <FlatList
                            data={data}
                            onLayout={onLayouFlatlist}
                            onScrollBeginDrag={onScrollBeginDrag}
                            onScrollEndDrag={onScrollEndDrag}
                            contentContainerStyle={styles.scrollStyle}
                            numColumns={2}
                            //ref={setRefList}
                            renderItem={renderItem}
                        />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ color: 'white' }} >Không có dữ liệu</Text>
                        </View>
                    )
                }
            </View>

            <Modal
                animationType="none"
                visible={showFilter}
                transparent={true}
            >
                <Filter setShowFilterModal={setShowFilterModal} />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#00444E',
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
    },
    optionsWrapper: {
        paddingHorizontal: 10,
        marginTop: 42,
    },
    optionsItem: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#FE94D9'
    },
    contentContainer: {
        flex: 1,
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(84,167,170,0.3)',
    },
    headerContent: {
        width: '100%',
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'rgba(108,196,198,0.3)',
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: 'white',
    },
    scrollStyle: {
        flexGrow: 1,
        padding: 10,
    },
    backgroundOfCard: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    inforWrapper: {
        height: 42,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
    },
    nameLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
    },
    addressLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 0.5
    }
})

