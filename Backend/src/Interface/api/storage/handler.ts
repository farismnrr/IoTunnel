import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IAuth } from "../../../Common/models/types";
import StorageService from "../../../App/services/server/storage.service";
import ResponseManager from "../../../Common/manager/manager.response";
import autoBind from "auto-bind";

class StorageHandler {
    private readonly _storageService: StorageService;
    private readonly _responseManager: typeof ResponseManager;

    constructor(storageService: StorageService, responseManager: typeof ResponseManager) {
        this._storageService = storageService;
        this._responseManager = responseManager;
        autoBind(this);
    }

    async uploadAdminFileHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const { file } = request.payload as { file: Express.Multer.File };
        const uploadedFile = await this._storageService.uploadAdminFile(file, admin.id);
        const response = {
            status: "success",
            message: "File uploaded successfully",
            data: {
                file_name: uploadedFile
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }

    async uploadUserFileHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const { file } = request.payload as { file: Express.Multer.File };
        const uploadedFile = await this._storageService.uploadUserFile(file, user.id);
        const response = {
            status: "success",
            message: "File uploaded successfully",
            data: {
                file_name: uploadedFile
            }
        };
        const encryptedResponse = this._responseManager.encrypt(response);
        return h.response(encryptedResponse).code(200);
    }
}

export default StorageHandler;
