
import CryptoJS from "crypto-js";

class AESmodule{
    encryptKey = "YourSecretKeyForEncryption&Descryption";

    encrypt(value){
        return CryptoJS.AES.encrypt(value, this.encryptKey.trim()).toString();
    }

    decrypt(textToDecrypt){
        return CryptoJS.AES.decrypt(textToDecrypt, this.encryptKey.trim()).toString(CryptoJS.enc.Utf8);
    }

}

export default AESmodule;