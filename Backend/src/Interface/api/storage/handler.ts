import type { Request, ResponseToolkit } from "@hapi/hapi";
import type { IAuth } from "../../../Common/models/types";
import StorageService from "../../../App/services/server/storage.service";
import StorageValidator from "../../../App/validators/storage";
import autoBind from "auto-bind";

class StorageHandler {
	private readonly _storageService: StorageService;
	private readonly _storageValidator: typeof StorageValidator;

	constructor(storageService: StorageService, storageValidator: typeof StorageValidator) {
		this._storageService = storageService;
		this._storageValidator = storageValidator;
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
					fileName: uploadedFile
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
					fileName: uploadedFile
				}
			})
			.code(200);
	}
}

export default StorageHandler;
