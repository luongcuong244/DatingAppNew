import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import UserApi from '../api/User.api';
import DeviceInfo from 'react-native-device-info';
import socketChat from '../socket/socket.config';
import ArrowIcon from '../../assets/vectors/arrow-left-ios.svg';

const SessionListScreen = (props) => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchSessions();
        socketChat.on(('forceLogoutSuccess'), () => {
            fetchSessions();
        });

        return () => {
            socketChat.off('forceLogoutSuccess');
        }
    }, []);

    const fetchSessions = () => {
        DeviceInfo.getUniqueId().then(async uniqueId => {
            try {
                const response = await UserApi.getUserSessions({
                    deviceId: uniqueId,
                }); // Thay bằng URL thực tế
                console.log('Sessions:', response.data);
                setSessions(response.data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            }
        });
    };

    const handleTerminalPress = async (session) => {
        socketChat.emit('forceDisconnect', {
            userId: session.userId,
            deviceId: session.deviceId,
        });
        setTimeout(() => {
            fetchSessions();
        }, 1000);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.text}>Mã thiết bị: {item.deviceId}</Text>
            <Text style={styles.text}>Tên thiết bị: {item.deviceName}</Text>
            <Text style={styles.text}>Vị trí: {item.address}</Text>
            <Text style={styles.text}>Thời gian đăng nhập: {item.createdAt}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleTerminalPress(item)}
            >
                <Text style={styles.buttonText}>Terminal</Text>
            </TouchableOpacity>
        </View>
    );

    const Header = () => {

        const onGoBack = () => { 
            props.navigation.goBack();
         }

        return (
            <View
                style={styles.headerContainer}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.backButton}
                    onPress={onGoBack}
                >
                    <ArrowIcon width={13} height={22.09} style={{ color: '#fff' }} />
                </TouchableOpacity>

                <View style={styles.headerTitleWrapper} >
                    <Text style={styles.headerTitle} >Danh sách thiết bị khác</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Header />
            {
                sessions.length > 0 && (
                    <FlatList
                        data={sessions}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }
            {
                sessions.length === 0 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff' }}>Không có thiết bị nào khác</Text>
                    </View>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00444E',
    },
    headerContainer: {
        backgroundColor: 'rgba(50,75,76,0.9)',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    backButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    itemContainer: {
        backgroundColor: '#1E3D40',
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: '#ffffff',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    flatListContent: {
        paddingVertical: 10,
    },
});

export default SessionListScreen;