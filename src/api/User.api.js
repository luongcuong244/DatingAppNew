import { API_URL } from './API_URL';
import axiosApiInstance from "../config/axios.instance.config";

class User_API {

    getUserInfor() {
        // let inforTest = {
        //     name: "Lương Cường",
        //     avatar: 'https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/255378713_1691092834561076_3158250997517573052_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=Zbqps2RZBAMAX8LakDv&_nc_ht=scontent.fhan4-3.fna&oh=00_AT9g7WmS5Ng5ZbUHDECuE5ftMOJCz1T2Gju61XwIEb9Dtg&oe=620B9FBF',
        //     dateOfBirth: '10/11/2002',
        //     gender: 'Nam',
        //     introduce: 'Tôi tên là Cường',
        //     listImage: [
        //         'https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        //         'https://images.pexels.com/photos/1047051/pexels-photo-1047051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        //         '',
        //         '',
        //         '',
        //         '',
        //         '',
        //     ]
        // }
        // callback(inforTest);
        // return;
        return axiosApiInstance.get(API_URL + "/users/get-user-info");
    }

    updateInfo(infor) {
        // axios.post(API_URL, {
        //     headers: {
        //         'x-access-token': "token",
        //     },
        // }).then((res) => {
        //     //callback(res.data.infor);
        // })
        // .catch(err => console.log(err));
        return axiosApiInstance.post(API_URL + "/users/update-info", infor);
    }
}

export default new User_API;