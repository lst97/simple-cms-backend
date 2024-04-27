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
}
@injectable()
class EndpointRepository {
	constructor() {}

	async createCollectionEndpoint(
		endpoint: CollectionEndpoint
	): Promise<CollectionEndpoint> {
		try {
			return await new CollectionEndpointModel(
				endpoint as CollectionEndpoint
			).save();
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
}

export default EndpointRepository;
