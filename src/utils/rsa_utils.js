import { RSA } from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class RsaUtils {
    static async _generatePairKey() {
        var keys = await RSA.generateKeys(4096) // set key size
        console.log('4096 private:', keys.private); // the private key
        console.log('4096 public:', keys.public); // the public key
        AsyncStorage.setItem('private_key', keys.private);
        AsyncStorage.setItem('public_key', keys.public);
        return {
            privateKey: keys.private,
            publicKey: keys.public
        };
    }

    static async getPairKey() {
        var privateKey = await AsyncStorage.getItem('private_key');
        var publicKey = await AsyncStorage.getItem('public_key');
        if (privateKey == null || publicKey == null) {
            return await this._generatePairKey();
        }
        return { privateKey: privateKey, publicKey: publicKey };
    }

    static async encrypt(text, publicKey) {
        return RSA.encrypt(text, publicKey);
    }

    static async decrypt(text) {
        const { privateKey } = await this.getPairKey();
        return RSA.decrypt(text, privateKey);
    }
}

export default RsaUtils;