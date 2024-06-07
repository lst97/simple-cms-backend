import { inject, injectable } from 'inversify';
import { DocumentReadError } from '../../errors/Errors';
import { CollectionForm } from '../../models/forms/CollectionForm';
import { Collection } from '../../models/share/collection/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';

@injectable()
class PostService {
	constructor(
		@inject(CollectionRepository)
		private CollectionRepository: CollectionRepository
	) {}

	public async createPost(
		username: string,
		form: CollectionForm,
		postsCollectionSlug: string
	): Promise<Collection> {
		const postCollection = await this.CollectionRepository.findBySlug(
			postsCollectionSlug
		);
		if (!postCollection) {
			throw new DocumentReadError({
				message: 'Post collection not found',
				query: { slug: postsCollectionSlug }
			});
		}

		const post = new Collection(username, form);

		const attributes: CollectionAttribute[] = [];

		if (post.setting?.comment) {

            attributes.push(new CollectionAttribute(new ));
		}
		if (post.setting?.reaction) {
		}
	}
}

export default PostService;
