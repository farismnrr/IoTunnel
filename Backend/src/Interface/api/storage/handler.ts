import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IAuth } from "../../../Common/models/types";
import StorageService from "../../../App/services/server/storage.service";
import autoBind from "auto-bind";

class StorageHandler {
    private readonly _storageService: StorageService;

    constructor(storageService: StorageService) {
        this._storageService = storageService;
        autoBind(this);
    }

    async uploadAdminFileHandler(request: Request, h: ResponseToolkit) {
        const admin = request.auth.credentials as unknown as IAuth;
        const { file } = request.payload as { file: Express.Multer.File };
        const uploadedFile = await this._storageService.uploadAdminFile(file, admin.id);
        return h
            .response({
                status: "success",
                message: "File uploaded successfully",
                data: {
                    file_name: uploadedFile
                }
            })
            .code(200);
    }

    async uploadUserFileHandler(request: Request, h: ResponseToolkit) {
        const user = request.auth.credentials as unknown as IAuth;
        const { file } = request.payload as { file: Express.Multer.File };
        const uploadedFile = await this._storageService.uploadUserFile(file, user.id);
        return h
            .response({
                status: "success",
                message: "File uploaded successfully",
                data: {
                    file_name: uploadedFile
                }
            })
            .code(200);
    }
}

export default StorageHandler;
