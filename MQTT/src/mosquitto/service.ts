import MosquittoRepository from "./repository";
import config from "../utils/config";

class MosquittoService {
    private readonly _mosquittoRepository: MosquittoRepository;

    constructor(mosquittoRepository: MosquittoRepository) {
        this._mosquittoRepository = mosquittoRepository;
    }

    async getServerConnection(): Promise<void> {
        const connection = await this._mosquittoRepository.getServerConnection();
        if (connection !== 200) {
            throw new Error("Failed to connect to server");
        }
    }

    async getMosquittoUser(apiKey: string): Promise<string[]> {
        if (!apiKey) {
            throw new Error("API key is required");
        }
        if (apiKey !== config.server.key) {
            throw new Error("Invalid API key");
        }
        return await this._mosquittoRepository.getMosquittoUser();
    }

    async postPassword(apiKey: string): Promise<void> {
        if (!apiKey) {
            throw new Error("API key is required");
        }
        const data = await this._mosquittoRepository.getWebhook(apiKey);
        await this._mosquittoRepository.updateMosquittoPassword(data);
    }

    async deletePassword(apiKey: string, userId: string): Promise<void> {
        if (!apiKey) {
            throw new Error("API key is required");
        }
        if (apiKey !== config.server.key) {
            throw new Error("Invalid API key");
        }
        await this._mosquittoRepository.deleteMosquittoPassword(userId);
    }
}

export default MosquittoService;
