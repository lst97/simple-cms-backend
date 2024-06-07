import { injectable } from 'inversify';
import {
	CollectionEndpoint,
	CollectionEndpointModel
} from '../../models/share/endpoint/Endpoint';
import { DocumentCreationError } from '../../errors/Errors';
import {
	Collection,
	CollectionModel
} from '../../models/share/collection/Collection';

// posts is a collection
@injectable()
class PostsRepository {
	constructor() {}

	async insertPost(
		slug: string,
		post: Collection
	): Promise<Collection | null> {
		try {
			const collection = await CollectionModel.findOneAndUpdate(
				{ slug },
				{ $push: { attributes: post } },
				{ new: true }
			);
			return collection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			} else {
				throw error;
			}
		}
	}
}

export default PostsRepository;
