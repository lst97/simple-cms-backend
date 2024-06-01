import { injectable } from 'inversify';
import {
	CollectionEndpoint,
	CollectionEndpointModel
} from '../../models/share/endpoint/Endpoint';
import { DocumentCreationError } from '../../errors/Errors';

export interface IEndpointRepository {
	createCollectionEndpoint(
		endpoint: CollectionEndpoint
	): Promise<CollectionEndpoint>;
	findCollectionEndpointBySlug(
		slug: string
	): Promise<CollectionEndpoint | null>;
	findCollectionEndpointsByUsername(
		username: string
	): Promise<CollectionEndpoint[] | null>;
	findCollectionEndpointsByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility: 'public' | 'private'
	): Promise<CollectionEndpoint[] | null>;
	deleteCollectionEndpointBySlug(
		username: string,
		slug: string
	): Promise<boolean>;
}
@injectable()
class EndpointRepository {
	constructor() {}

	async createCollectionEndpoint(
		endpoint: CollectionEndpoint
	): Promise<CollectionEndpoint> {
		try {
			return CollectionEndpointModel.create(endpoint);
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}

	async findCollectionEndpointBySlug(
		slug: string
	): Promise<CollectionEndpoint | null> {
		return CollectionEndpointModel.findOne({ slug });
	}

	async findCollectionEndpointsByUsername(
		username: string
	): Promise<CollectionEndpoint[] | null> {
		return CollectionEndpointModel.find({ username });
	}

	async findCollectionEndpointsByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility = 'public'
	): Promise<CollectionEndpoint[] | null> {
		return CollectionEndpointModel.find({
			username: username,
			prefix: prefix,
			visibility: visibility
		}).exec();
	}

	async deleteCollectionEndpointBySlug(
		username: string,
		slug: string
	): Promise<boolean> {
		const result = await CollectionEndpointModel.deleteOne({
			username: username,
			slug: slug
		});
		return result.deletedCount === 1;
	}
}

export default EndpointRepository;
