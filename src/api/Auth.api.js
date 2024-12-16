import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";

const PATH = {
    sign_in: API_URL + "/auths/login",
    sign_up: API_URL + "/auths/register"
}

class Auth_API {
    signIn(userInfor) {
        return axiosApiInstance.post(PATH.sign_in, userInfor);
    }

    signUp(userInfor) {
        return axiosApiInstance.post(PATH.sign_up, userInfor);
    }

    signOut(callback) {
        
    }
}

export default new Auth_API;