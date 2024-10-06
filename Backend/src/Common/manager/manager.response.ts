import CryptoJS from "crypto-js";

const privateKey = process.env.PRIVATE_KEY || "";
const publicKey = process.env.PUBLIC_KEY || "";

const ResponseManager = {
    encrypt(response: object): string | object {
        if (process.env.NODE_ENV === "development") {
            return response;
        }
        const nonce = CryptoJS.lib.WordArray.random(16).toString();
        const passphrase = CryptoJS.SHA256(privateKey + publicKey + nonce).toString();
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(response), passphrase, {
            nonce: nonce
        });
        return encrypted.toString() + ":" + nonce;
    },

    decrypt(ciphertext: string): string | object {
        if (process.env.NODE_ENV === "development") {
            return ciphertext;
        }
        const ciphertextParts = ciphertext.split(":");
        if (ciphertextParts.length !== 2) {
            return "";
        }
        const encrypted = ciphertextParts[0];
        const nonce = ciphertextParts[1];
        const passphrase = CryptoJS.SHA256(privateKey + publicKey + nonce).toString();
        try {
            const decrypted = CryptoJS.AES.decrypt(encrypted, passphrase, { nonce: nonce });
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        } catch {
            return "";
        }
    }
};

export default ResponseManager;
