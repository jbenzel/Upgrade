
const CryptoJS = require("crypto-js");

class AESmodule{
    encryptKey = "YourSecretKeyForEncryption&Descryption";

    constructor(){}

    encrypt(value){
        return CryptoJS.AES.encrypt(value, this.encryptKey.trim()).toString();
    }

    decrypt(textToDecrypt){
        return CryptoJS.AES.decrypt(textToDecrypt, this.encryptKey.trim()).toString(CryptoJS.enc.Utf8);
    }

}

exports.AESmodule = AESmodule;