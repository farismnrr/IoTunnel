import Token from "./token";
import EncryptionManager from "@/composables/utils/encryption";
import type { Config, TokenResponse, BaseResponse } from "@/composables/model";

interface TokenInterface {
    getCookie: () => Promise<{ userToken: string | null; adminToken: string | null }>;
    userTokenUpdate: () => Promise<TokenResponse>;
    adminTokenUpdate: () => Promise<TokenResponse>;
    userTokenDelete: () => Promise<BaseResponse>;
    adminTokenDelete: () => Promise<BaseResponse>;
}

const useToken = (config: Config): TokenInterface => {
    const encryptionManager = new EncryptionManager(config.public.privateKey, config.public.publicKey);
    const token = new Token(config.public.apiUrl, config.public.apiSecret, encryptionManager);

    return {
        getCookie: () => token.getCookie(),
        userTokenUpdate: () => token.userTokenUpdate(),
        adminTokenUpdate: () => token.adminTokenUpdate(),
        userTokenDelete: () => token.userTokenDelete(),
        adminTokenDelete: () => token.adminTokenDelete()
    };
};

export default useToken;
