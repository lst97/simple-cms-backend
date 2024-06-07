import { getModelForClass, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { CollectionAttribute } from './CollectionAttributes';
import { Collection } from './Collection';

export class BaseContent {
	@prop({ required: true, default: new ObjectId() })
	public _id!: ObjectId;

	@prop({ required: false })
	public value?: string | MediaContent | MediaContent[] | Collection[];

	@prop({ required: false })
	sessionId?: string;

	@prop({ required: false })
	total?: number;

	@prop({ required: false })
	groupId?: string;

	constructor(
		content?: string | MediaContent | MediaContent[] | Collection[]
	) {
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

export class PostsContent extends BaseContent {
	constructor(content: string) {
		super(content);
	}
}

export interface IComment {
	_id: ObjectId;
	postId: ObjectId;
	username: string;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
	votes: Vote[];
	replies?: Comment[];
	status?: CommentStatus;
}

export class Comment extends BaseContent {
	@prop({ required: true })
	postId!: ObjectId;

	@prop({ required: true })
	username!: string;

	@prop({ required: true, default: Date.now })
	createdAt!: Date;

	@prop({ required: false })
	updatedAt?: Date;

	@prop({ required: true, default: [] })
	votes!: Vote[];

	@prop({ required: false })
	replies?: Comment[];

	@prop({ required: false })
	status!: CommentStatus;

	constructor(postId: ObjectId, username: string, content: string) {
		super(content);
		this.postId = postId;
		this.username = username;
		this.createdAt = new Date();
		this.votes = [];
		this.status = CommentStatus.Published;
	}
}

enum CommentStatus {
	Published = 'published',
	Pending = 'pending'
}

export interface IVote {
	username: string;
	value: VoteValue; // Upvote or downvote
}

export class Vote {
	@prop({ required: true })
	username!: string;

	@prop({ required: true })
	value!: VoteValue;

	constructor(username: string, value: VoteValue) {
		this.username = username;
		this.value = value;
	}
}

enum VoteValue {
	Upvote = 1,
	Downvote = -1
}

export const BaseContentModel = getModelForClass(BaseContent);
export const MediaContentModel = getModelForClass(MediaContent);
export const ParallelFilesUploadContentModel = getModelForClass(
	ParallelFilesUploadContent
);
export const CommentContentModel = getModelForClass(Comment);
