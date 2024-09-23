import { Storage } from "@google-cloud/storage";
import multer from "multer";
import sharp from "sharp";

class StorageRepository {
    private readonly _storage: Storage;
    private readonly _multer: multer.Multer;
    private readonly bucketName: string;

    constructor({
        projectId,
        bucketName,
        keyFilename
    }: {
        projectId: string;
        bucketName: string;
        keyFilename: string;
    }) {
        this._storage = new Storage({ projectId, keyFilename });
        this._multer = multer({
            storage: multer.memoryStorage()
        });
        this.bucketName = bucketName;
    }

    async uploadFileAdmin(file: Express.Multer.File, fileName: string) {
        if (!file.buffer) {
            return null;
        }
        const bucket = this._storage.bucket(this.bucketName);
        const fileUpload = bucket.file(`admins-photo/${fileName}`);
        const [exists] = await fileUpload.exists();
        if (exists) {
            await fileUpload.delete();
        }

        const imageBuffer = await sharp(file.buffer).resize(250, 250).toBuffer();

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                cacheControl: "no-cache"
            }
        });

        blobStream.on("error", error => {
            throw error;
        });

        blobStream.write(imageBuffer);
        blobStream.end();

        return `https://storage.googleapis.com/${this.bucketName}/admins-photo/${fileName}`;
    }

    async uploadFileUser(file: Express.Multer.File, fileName: string) {
        if (!file.buffer) {
            return null;
        }
        const bucket = this._storage.bucket(this.bucketName);
        const fileUpload = bucket.file(`users-photo/${fileName}`);
        const [exists] = await fileUpload.exists();
        if (exists) {
            await fileUpload.delete();
        }

        const imageBuffer = await sharp(file.buffer).resize(250, 250).toBuffer();

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                cacheControl: "no-cache"
            }
        });

        blobStream.on("error", error => {
            throw error;
        });

        blobStream.write(imageBuffer);
        blobStream.end();

        return `https://storage.googleapis.com/${this.bucketName}/users-photo/${fileName}`;
    }
}

export default StorageRepository;
