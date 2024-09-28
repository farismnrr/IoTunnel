import CryptoJS from "crypto-js";
import { useRuntimeConfig } from "#imports";

function encrypt(text: string) {
    const config = useRuntimeConfig();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const passphrase = CryptoJS.SHA256(
        config.public.privateKey + config.public.publicKey + nonce
    ).toString();
    const encrypted = CryptoJS.AES.encrypt(text, passphrase, { nonce: nonce });
    return encrypted.toString() + ":" + nonce;
}

function decrypt(ciphertext: string) {
    const config = useRuntimeConfig();
    const ciphertextParts = ciphertext.split(":");
    if (ciphertextParts.length !== 2) {
        return "";
    }
    const encrypted = ciphertextParts[0];
    const nonce = ciphertextParts[1];
    const passphrase = CryptoJS.SHA256(
        config.public.privateKey + config.public.publicKey + nonce
    ).toString();
    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, passphrase, { nonce: nonce });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return "";
    }
}

export { encrypt, decrypt };
