import { injectable } from 'inversify';
import {
	CollectionEndpoint,
	CollectionEndpointModel
} from '../../models/share/endpoint/Endpoint';
import { DocumentCreationError, DocumentReadError } from '../../errors/Errors';
import {
	Collection,
	CollectionModel,
	PostsCollectionModel
} from '../../models/share/collection/Collection';

// posts is a collection
@injectable()
class PostsRepository {
	constructor() {}

	async insertPost(
		postsCollectionSlug: string,
		post: Collection
	): Promise<Collection | null> {
		try {
			const collection = PostsCollectionModel.findOneAndUpdate(
				{ postsCollectionSlug },
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

	async findPosts(slug: string): Promise<Collection | null> {
		try {
			const collection = PostsCollectionModel.findOne({
				slug: slug
			});

			return collection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentReadError({
					message: error.message,
					query: { slug }
				});
			} else {
				throw error;
			}
		}
	}

	async createPostsCollection(
		postsCollection: Collection
	): Promise<Collection | null> {
		try {
			const collection = PostsCollectionModel.create(postsCollection);

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
