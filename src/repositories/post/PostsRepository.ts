import { injectable } from 'inversify';
import { DocumentCreationError, DocumentReadError } from '../../errors/Errors';
import {
	Collection,
	PostsCollectionModel
} from '../../models/share/collection/Collection';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';

// posts is a collection
@injectable()
class PostsRepository {
	constructor() {}

	async insertPost(
		postsCollectionSlug: string,
		postAttribute: CollectionAttribute
	): Promise<Collection | null> {
		try {
			const collection = PostsCollectionModel.findOneAndUpdate(
				{ slug: postsCollectionSlug },
				{ $push: { attributes: postAttribute } },
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

	async findPostsCollection(slug: string): Promise<Collection | null> {
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

	async findPostsCollectionsByUsername(
		username: string
	): Promise<Collection[]> {
		try {
			const collections = PostsCollectionModel.find({
				username
			});

			return collections;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentReadError({
					message: error.message,
					query: { username }
				});
			} else {
				throw error;
			}
		}
	}

	async deletePostsCollectionAttributeBySlug(
		postsCollectionSlug: string,
		postSlug: string
	) {
		try {
			const collection = PostsCollectionModel.findOneAndUpdate(
				{ slug: postsCollectionSlug },
				{
					$pull: {
						attributes: { 'content.value': postSlug }
					}
				},
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
