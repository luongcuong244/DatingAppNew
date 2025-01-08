import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";
import DeviceInfo from 'react-native-device-info';

const PATH = {
    sign_in: API_URL + "/auths/login",
    sign_up: API_URL + "/auths/register",
    sign_out: API_URL + "/auths/logout"
}

class Auth_API {
    signIn(userInfor) {
        return axiosApiInstance.post(PATH.sign_in, userInfor);
    }

    signUp(userInfor) {
        return axiosApiInstance.post(PATH.sign_up, userInfor);
    }

    async signOut() {
        const deviceId = await DeviceInfo.getUniqueId();
        return axiosApiInstance.post(PATH.sign_out, {
            deviceId: deviceId
        });
    }
}

export default new Auth_API;