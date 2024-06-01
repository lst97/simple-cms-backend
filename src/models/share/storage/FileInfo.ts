import { getModelForClass, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export type FileTypes = 'image' | 'video' | 'audio' | 'document';
export interface FileInfoParams {
	username: string;
	groupId?: string;
	fileName: string;
	type: FileTypes;
}

export class FileInfo {
	@prop({ required: true, default: new ObjectId() })
	_id: ObjectId;

	@prop({ required: true })
	username: string;

	@prop({ required: false })
	groupId?: string;

	@prop({ required: true })
	fileName: string;

	@prop({ required: true })
	type: FileTypes;

	@prop({ required: true, default: Date.now })
	createdAt!: Date;

	@prop({ required: true, default: Date.now })
	updatedAt!: Date;

	constructor({ username, groupId, fileName, type }: FileInfoParams) {
		this._id = new ObjectId();
		this.username = username;
		this.groupId = groupId;
		this.fileName = fileName;
		this.type = type;
	}
}

export const FileInfoModel = getModelForClass(FileInfo);
