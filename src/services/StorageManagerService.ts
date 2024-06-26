import { inject, injectable } from 'inversify';
import StorageRepository, {
	IStorageRepository
} from '../repositories/storage/StorageRepository';
import multer from 'multer';
import { ObjectId } from 'mongodb';
import path from 'path';
import { Request } from 'express';
import * as fs from 'fs-extra';
import { User } from '../models/database/User';
import { Mutex } from 'async-mutex';
import { ServerResourceNotFoundError } from '@lst97/common-errors';

const createFolderIfNotExist = (destination: string) => {
	if (!destination) return;

	if (!fs.existsSync(destination)) {
		fs.mkdirSync(destination, { recursive: true });
	}
};

const storage = multer.diskStorage({
	destination: function (req: Request, file, cb) {
		const mediaType = req.query.type;
		const sessionId = req.query.sessionId as string;

		if (!sessionId) {
			cb(new Error('sessionId is required'), '');
			return;
		}

		if (!mediaType) {
			cb(new Error('type is required'), '');
			return;
		}

		if (
			mediaType !== 'image' &&
			mediaType !== 'video' &&
			mediaType !== 'audio'
		) {
			cb(new Error('mediaType is invalid'), '');
			return;
		}

		const destination = path.join(
			path.resolve(__dirname, '..', '..'),
			'database',
			'storage',
			'temp',
			(req.user! as User).username,
			sessionId
		);

		createFolderIfNotExist(destination);
		cb(null, destination);
	},
	filename: function (req, file, cb) {
		if (req.body.fileNameMap === undefined) {
			req.body.fileNameMap = {};
		}

		const fileName =
			new ObjectId().toHexString() + path.extname(file.originalname);

		req.body.fileNameMap[file.originalname] = fileName;
		cb(null, fileName);
	}
});

export interface IStorageManagerService {
	getMappedFileNames(sessionId: string): Map<string, string>;
	getPendingFiles(username: string, sessionId: string): Promise<number>;
	received(
		sessionId: string,
		originFileName: string,
		mappedFileName: string
	): Promise<void>;
	movePendingFilesToStorage(
		username: string,
		sessionId: string,
		type: string,
		groupId?: string
	): Promise<void>;
	upload: multer.Multer;
	getFile(username: string, fileId: string): string;
}

interface IFileNameMapperService {
	appendToPendingFileNameMap(
		sessionId: string,
		key: string,
		value: string
	): Promise<void>;
	getPendingFileNameMap(sessionId: string): Map<string, string>;
	removePendingFileNameMap(sessionId: string): void;
}

@injectable()
export class FileNameMapperService implements IFileNameMapperService {
	private fileNameMap: Map<string, Map<string, string>>;
	private mutexMap: Map<string, Mutex>;

	constructor() {
		this.fileNameMap = new Map<string, Map<string, string>>();
		this.mutexMap = new Map<string, Mutex>();
	}

	// Method to get or create a mutex for a sessionId
	private getSessionMutex(sessionId: string): Mutex {
		let mutex = this.mutexMap.get(sessionId);
		if (!mutex) {
			mutex = this.createFileSession(sessionId);
		}
		return mutex;
	}

	private createFileSession(sessionId: string): Mutex {
		let mutex = new Mutex();
		this.mutexMap.set(sessionId, mutex);

		this.fileNameMap.set(sessionId, new Map());

		return mutex;
	}

	// Append method using sessionId-specific mutex
	public async appendToPendingFileNameMap(
		sessionId: string,
		key: string,
		value: string
	): Promise<void> {
		const mutex = this.getSessionMutex(sessionId);
		await mutex.runExclusive(async () => {
			const nameMap = this.fileNameMap.get(sessionId);
			nameMap!.set(key, value);
		});
	}

	public getPendingFileNameMap(sessionId: string): Map<string, string> {
		return this.fileNameMap.get(sessionId) ?? new Map();
	}

	private removeSessionMutex(sessionId: string): void {
		this.mutexMap.delete(sessionId);
	}

	public removePendingFileNameMap(sessionId: string): void {
		const mutex = this.getSessionMutex(sessionId);
		mutex.runExclusive(() => {
			this.fileNameMap.delete(sessionId);
		});
		this.removeSessionMutex(sessionId);
	}
}
@injectable()
export class StorageManagerService implements IStorageManagerService {
	public readonly upload = multer({ storage: storage });

	constructor(
		@inject(StorageRepository)
		private storageRepository: IStorageRepository,
		@inject(FileNameMapperService)
		private fileNameMapperService: FileNameMapperService
	) {}

	public getFile(username: string, fileId: string) {
		const destination = path.join(
			path.resolve(__dirname, '..', '..'),
			'database',
			'storage',
			username
		);

		if (!fs.existsSync(destination)) {
			throw new ServerResourceNotFoundError('File not found');
		}

		const folders = ['image', 'audio', 'video', 'document'];
		for (const folder of folders) {
			const folderPath = path.join(destination, folder);
			if (fs.existsSync(folderPath)) {
				const files = fs.readdirSync(folderPath);
				for (const file of files) {
					const id = file.split('.')[0];
					if (fileId === id) {
						return path.join(folderPath, file);
					}
				}
			}
		}

		throw new ServerResourceNotFoundError('File not found');
	}

	public getMappedFileNames(sessionId: string) {
		return this.fileNameMapperService.getPendingFileNameMap(sessionId);
	}

	public async getPendingFiles(
		username: string,
		sessionId: string
	): Promise<number> {
		const destination = path.join(
			path.resolve(__dirname, '..', '..'),
			'database',
			'storage',
			'temp',
			username,
			sessionId
		);

		if (!fs.existsSync(destination)) {
			return 0;
		}

		return fs.readdirSync(destination).length;
	}

	public async received(
		sessionId: string,
		originFileName: string,
		mappedFileName: string
	) {
		await this.fileNameMapperService.appendToPendingFileNameMap(
			sessionId,
			originFileName,
			mappedFileName
		);
	}

	public async movePendingFilesToStorage(
		username: string,
		sessionId: string,
		type: string,
		groupId?: string
	) {
		const destination = path.join(
			path.resolve(__dirname, '..', '..'),
			'database',
			'storage',
			username,
			type,
			groupId ?? ''
		);

		createFolderIfNotExist(destination);

		const source = path.join(
			path.resolve(__dirname, '..', '..'),
			'database',
			'storage',
			'temp',
			username,
			sessionId
		);

		const files = fs.readdirSync(source);

		for (const file of files) {
			fs.renameSync(
				path.join(source, file),
				path.join(destination, file)
			);
		}

		// delete the temp folder
		fs.remove(source).catch((error) => {
			console.error(error);
		});
	}
}
