import StorageRepository from "../../../Infrastructure/repositories/server/storage/storage.repo";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";
import AuthRepository from "../../../Infrastructure/repositories/server/postgres/auth.repo";
import { UnsupportedMediaTypeError, AuthorizationError } from "../../../Common/errors";

class UploadService {
	private _storageRepository: StorageRepository;
	private _adminRepository: AdminRepository;
	private _userRepository: UserRepository;
	private _authRepository: AuthRepository;

	constructor(
		storageRepository: StorageRepository,
		adminRepository: AdminRepository,
		userRepository: UserRepository,
		authRepository: AuthRepository
	) {
		this._storageRepository = storageRepository;
		this._adminRepository = adminRepository;
		this._userRepository = userRepository;
		this._authRepository = authRepository;
	}

	async uploadAdminFile(file: Express.Multer.File, adminId: string): Promise<string> {
		const adminRole = await this._authRepository.getAdminRole(adminId);
		if (adminRole !== "admin") {
			throw new AuthorizationError("You are not authorized to add this product");
		}
		const fileName = `profile-${adminId}.jpg`;
		const uploadedFile = await this._storageRepository.uploadFileAdmin(file, fileName);
		if (!uploadedFile) {
			throw new UnsupportedMediaTypeError("File must be an image");
		}
		await this._adminRepository.editAdminPhoto(adminId, uploadedFile as string);
		return uploadedFile as string;
	}

	async uploadUserFile(file: Express.Multer.File, userId: string): Promise<string> {
		const userRole = await this._authRepository.getUserRole(userId);
		if (userRole !== "user") {
			throw new AuthorizationError("You are not authorized to add this product");
		}
		const fileName = `profile-${userId}.jpg`;
		const fileUrl = await this._storageRepository.uploadFileUser(file, fileName);
		if (!fileUrl) {
			throw new UnsupportedMediaTypeError("File must be an image");
		}
		await this._userRepository.editUserPhoto(userId, fileUrl as string);
		return fileUrl as string;
	}
}

export default UploadService;
