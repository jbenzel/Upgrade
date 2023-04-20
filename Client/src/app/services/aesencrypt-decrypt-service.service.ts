import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptServiceService {

  encryptKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.encryptKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.encryptKey.trim()).toString(CryptoJS.enc.Utf8);
  }
  
}
