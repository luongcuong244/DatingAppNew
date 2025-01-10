import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";
import DeviceInfo from 'react-native-device-info';
import RsaUtils from '../utils/rsa_utils';

class User_API {
    getCurrentInfo(body) {
        return axiosApiInstance.post(API_URL + "/users/get-current-info", body);
    }

    getUserInfo(body) {
        return axiosApiInstance.post(API_URL + "/users/get-user-info", body);
    }

    updateInfo(body) {
        return axiosApiInstance.post(API_URL + "/users/update-info", body, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Required for file upload
            },
        });
    }

    getAll() {
        return axiosApiInstance.get(API_URL + "/users/all");
    }

    addToListLike(body) {
        return axiosApiInstance.post(API_URL + "/users/add-to-listlike", body);
    }

    getAllUserInListLike() {
        return axiosApiInstance.get(API_URL + "/users/all-user-in-listlike");
    }

    getAllUserLikeMe() {
        return axiosApiInstance.get(API_URL + "/users/all-user-like-me");
    }

    removeFromListLike(userIdToRemove) {
        return axiosApiInstance.post(API_URL + "/users/remove-from-listlike", {
            userIdToRemove
        });
    }

    updateLocation(body) {
        return axiosApiInstance.put(API_URL + "/users/location", body);
    }

    getUserNearby(body) {
        return axiosApiInstance.post(API_URL + "/users/get-user-nearby", body);
    }

    getUserSessions(body) {
        return axiosApiInstance.post(API_URL + "/users/get-user-sessions", body);
    }

    async sendRsaDeviceInfo() {
        const rsaPublicKey = (await RsaUtils.getPairKey()).publicKey;
        const deviceId = await DeviceInfo.getUniqueId();
        return axiosApiInstance.post(API_URL + "/users/send-rsa-device-info", {
            rsaPublicKey,
            deviceId,
        });
    }
}

export default new User_API;