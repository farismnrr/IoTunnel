import CryptoJS from "crypto-js";

class ResponseManager {
    private _privateKey: string;
    private _publicKey: string;
    constructor(privateKey: string, publicKey: string) {
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }

    async encrypt(response: object): Promise<string | object> {
        const nonce = CryptoJS.lib.WordArray.random(16).toString();
        const passphrase = CryptoJS.SHA256(this._privateKey + this._publicKey + nonce).toString();
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(response), passphrase, {
            nonce: nonce
        });
        return encrypted.toString() + ":" + nonce;
    }

    async decrypt(ciphertext: string): Promise<string | object> {
        const ciphertextParts = ciphertext.split(":");
        if (ciphertextParts.length !== 2) {
            return "";
        }
        const encrypted = ciphertextParts[0];
        const nonce = ciphertextParts[1];
        const passphrase = CryptoJS.SHA256(this._privateKey + this._publicKey + nonce).toString();
        try {
            const decrypted = CryptoJS.AES.decrypt(encrypted, passphrase, { nonce: nonce });
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        } catch {
            return "";
        }
    }
}

export default ResponseManager;
