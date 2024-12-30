import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";

class User_API {
    getCurrentInfo() {
        return axiosApiInstance.get(API_URL + "/users/get-current-info");
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
}

export default new User_API;