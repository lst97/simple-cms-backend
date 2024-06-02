import { getModelForClass, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class BaseContent {
	@prop({ required: true, default: new ObjectId() })
	public _id!: ObjectId;

	@prop({ required: false })
	public value?: string | MediaContent | MediaContent[];

	@prop({ required: false })
	sessionId?: string;

	@prop({ required: false })
	total?: number;

	@prop({ required: false })
	groupId?: string;

	constructor(content?: string | MediaContent) {
		this.value = content;
		this._id = new ObjectId();
	}
}

export interface MediaContentProps {
	url: string;
	fileName: string;
	file?: string;
}

export class ParallelFilesUploadContent extends BaseContent {
	constructor(
		sessionId: string,
		total: number,
		groupId?: string,
		value?: MediaContent[]
	) {
		super();
		this.sessionId = sessionId;
		this.total = total;
		this.groupId = groupId;
		this.value = value ?? [];
	}
}

export class MediaContent {
	@prop({ required: true })
	public url!: string;

	@prop({ required: false })
	public file?: string; // base64

	@prop({ required: true })
	public fileName: string;

	constructor({ url, file, fileName }: MediaContentProps) {
		this.url = url;
		this.file = file;
		this.fileName = fileName;
	}
}

export const BaseContentModel = getModelForClass(BaseContent);
export const MediaContentModel = getModelForClass(MediaContent);
export const ParallelFilesUploadContentModel = getModelForClass(
	ParallelFilesUploadContent
);
