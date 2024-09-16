import StorageRepository from "../../../Infrastructure/repositories/server/storage/storage.repo";
import AdminRepository from "../../../Infrastructure/repositories/server/postgres/admin.repo";
import UserRepository from "../../../Infrastructure/repositories/server/postgres/user.repo";

class UploadService {
	private _storageRepository: StorageRepository;
	private _adminRepository: AdminRepository;
	private _userRepository: UserRepository;

	constructor(
		storageRepository: StorageRepository,
		adminRepository: AdminRepository,
		userRepository: UserRepository
	) {
		this._storageRepository = storageRepository;
		this._adminRepository = adminRepository;
		this._userRepository = userRepository;
	}

	async uploadAdminFile(file: Express.Multer.File, adminId: string): Promise<string> {
		const fileName = `profile-${adminId}-${Date.now()}.jpg`;
		const uploadedFile = await this._storageRepository.uploadFileAdmin(file, fileName);
		await this._adminRepository.editAdminPhoto(adminId, uploadedFile);
		return uploadedFile;
	}

	async uploadUserFile(file: Express.Multer.File, userId: string): Promise<string> {
		const fileName = `profile-${userId}-${Date.now()}.jpg`;
		const fileUrl = await this._storageRepository.uploadFileUser(file, fileName);
		await this._userRepository.editUserPhoto(userId, fileUrl);
		return fileUrl;
	}
}

export default UploadService;
