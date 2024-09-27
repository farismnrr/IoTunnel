import CryptoJS from "crypto-js";
import { useRuntimeConfig } from "#imports";

function encrypt(text: string) {
    const config = useRuntimeConfig();
    const passphrase = config.public.privateKey + config.public.publicKey;
    return CryptoJS.AES.encrypt(text, passphrase).toString();
}

function decrypt(ciphertext: string) {
    const config = useRuntimeConfig();
    const passphrase = config.public.privateKey + config.public.publicKey;
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
