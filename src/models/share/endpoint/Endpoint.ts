import { getModelForClass, prop } from '@typegoose/typegoose';

export interface CollectionEndpointParams {
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
}

export interface IEndpoint {
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
	createdAt: Date;
	updatedAt: Date;
}

export interface ICollectionEndpoint {
	username: string;
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
	createdAt: Date;
	updatedAt: Date;
}
/**
 * A endpoint is a representation of a RESTful endpoint.
 */
export class CollectionEndpoint {
	@prop({ required: true })
	username: string;

	@prop({ required: true, default: '/' })
	prefix: string;

	@prop({ required: true, unique: true })
	slug: string;

	@prop({ required: true })
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

	@prop({ required: true })
	status: 'published' | 'draft';

	@prop({ required: true })
	visibility: 'public' | 'private';

	@prop({ required: true, default: Date.now })
	createdAt!: Date;

	@prop({ required: true, default: Date.now })
	updatedAt!: Date;

	constructor(
		createdBy: string,
		{ prefix, slug, method, status, visibility }: CollectionEndpointParams
	) {
		this.username = createdBy;
		this.prefix = prefix === '' ? '/' : prefix;
		this.slug = slug;
		this.method = method;
		this.status = status;
		this.visibility = visibility;
	}
}

export const CollectionEndpointModel = getModelForClass(CollectionEndpoint);
