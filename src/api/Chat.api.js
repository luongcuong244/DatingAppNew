import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";

class Chat_API {
    addMessage(body) {
        return axiosApiInstance.post(API_URL + "/mess/add-messages", body);
    }
}

export default new Chat_API;