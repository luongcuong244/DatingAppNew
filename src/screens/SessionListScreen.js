import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import UserApi from '../api/User.api';
import DeviceInfo from 'react-native-device-info';
import socketChat from '../socket/socket.config';
import ArrowIcon from '../../assets/vectors/arrow-left-ios.svg';

const SessionListScreen = (props) => {
    const [sessions, setSessions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const item = useRef(null);

    useEffect(() => {
        fetchSessions();
        socketChat.on(('forceLogoutSuccess'), () => {
            fetchSessions();
        });

        return () => {
            socketChat.off('forceLogoutSuccess');
        }
    }, []);

    const handleConfirm = () => {
        setResultText(inputText); // Lưu text đã nhập
        setModalVisible(false);  // Ẩn dialog
        handleTerminalPress(item.current);
    };

    const handleCancel = () => {
        setInputText(''); // Xóa text đã nhập
        setModalVisible(false); // Ẩn dialog
    };

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
                //onPress={() => handleTerminalPress(item)}
                onPress={() => {
                    setModalVisible(true);
                    item.current = item;
                }}
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
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Xác nhận mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu..."
                            value={inputText}
                            secureTextEntry={true}
                            onChangeText={setInputText}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SessionListScreen;