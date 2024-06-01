import { injectable } from 'inversify';
import { DocumentCreationError } from '../../errors/Errors';
import { FileInfo, FileInfoModel } from '../../models/share/storage/FileInfo';

export interface IStorageRepository {
	createFile(fileInfo: FileInfo): Promise<FileInfo>;
	deleteFile(username: string, fileId: string): Promise<boolean>;
	findFile(username: string, fileId: string): Promise<FileInfo | null>;
	findFiles(username: string, fileIds: string[]): Promise<FileInfo[]>;
	listFiles(username: string, groupId: string): Promise<FileInfo[]>;
	deleteGroup(username: string, groupId: string): Promise<boolean>;
	createFilesIntoGroup(fileInfos: FileInfo[]): Promise<boolean>;
	deleteFilesFromGroup(
		username: string,
		groupId: string,
		fileIds: string[]
	): Promise<boolean>;
}

// info about the file, the data is storage on the disk not database
@injectable()
class StorageRepository implements IStorageRepository {
	constructor() {}
	findFiles(username: string, fileIds: string[]): Promise<FileInfo[]> {
		return FileInfoModel.find({
			username: username,
			_id: { $in: fileIds }
		});
	}

	async createFile(fileInfo: FileInfo): Promise<FileInfo> {
		try {
			return await FileInfoModel.create({
				fileInfo
			});
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}

	async createFilesIntoGroup(fileInfos: FileInfo[]): Promise<boolean> {
		try {
			await FileInfoModel.insertMany(fileInfos);

			return true;
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}

	async deleteFilesFromGroup(
		username: string,
		groupId: string,
		fileIds: string[]
	): Promise<boolean> {
		const result = await FileInfoModel.deleteMany({
			username: username,
			groupId: groupId,
			_id: { $in: fileIds }
		});

		return result.deletedCount === fileIds.length;
	}

	async findFile(username: string, id: string): Promise<FileInfo | null> {
		return await FileInfoModel.findOne({
			username: username,
			_id: id
		});
	}

	async listFiles(username: string, groupId: string): Promise<FileInfo[]> {
		return FileInfoModel.find({
			username: username,
			groupId: groupId
		});
	}

	async deleteFile(username: string, id: string): Promise<boolean> {
		const result = await FileInfoModel.deleteOne({
			username: username,
			_id: id
		});
		return result.deletedCount === 1;
	}

	async deleteGroup(username: string, groupId: string): Promise<boolean> {
		const result = await FileInfoModel.deleteMany({
			username: username,
			groupId: groupId
		});
		return result.deletedCount >= 1;
	}
}

export default StorageRepository;
