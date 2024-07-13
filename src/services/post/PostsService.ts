import { inject, injectable } from 'inversify';
import { DocumentReadError } from '../../errors/Errors';
import { CollectionForm } from '../../models/forms/CollectionForm';
import { Collection } from '../../models/share/collection/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';
import {
	CommentTypeSetting,
	ReactionTypeSetting,
	TextTypeSetting
} from '../../models/share/collection/AttributeTypeSettings';
import {
	BaseContent,
	CommentContent,
	ReactionContent
} from '../../models/share/collection/AttributeContents';
import { ObjectId } from 'mongodb';
import PostsRepository from '../../repositories/post/PostsRepository';
import EndpointService, { IEndpointService } from '../endpoint/EndpointService';

@injectable()
export class PostsService {
	constructor(
		@inject(CollectionRepository)
		private collectionRepository: CollectionRepository,
		@inject(PostsRepository)
		private postsRepository: PostsRepository,
		@inject(EndpointService)
		private endpointService: IEndpointService
	) {}

	public async createPost(
		username: string,
		form: CollectionForm
	): Promise<Collection> {
		if (!form.ref) {
			throw new DocumentReadError({
				message: 'Posts collection not found',
				query: { slug: form.ref }
			});
		}
		const postsCollection = await this.collectionRepository.findBySlug(
			form.ref
		);
		if (!postsCollection) {
			throw new DocumentReadError({
				message: 'Post collection not found',
				query: { slug: form.ref }
			});
		}

		const post = new Collection(username, form);

		const attributes: CollectionAttribute[] = [];

		// insert comment and reaction attributes if it's a post
		if (form.kind === 'post') {
			const titleTextSetting = new TextTypeSetting(
				'Title',
				'text',
				{},
				{ textType: 'short_text' }
			);
			const postContentSetting = new TextTypeSetting(
				'Content',
				'text',
				{},
				{ textType: 'reach_text' }
			);
			const commentSetting = new CommentTypeSetting(
				'Comment',
				'comment',
				{}
			);
			const commentContent = new CommentContent(
				new ObjectId(form.ref),
				username
			);

			const reactionSetting = new ReactionTypeSetting(
				'Reaction',
				'reaction',
				{}
			);
			const reactionContent = new ReactionContent();

			attributes.push(
				new CollectionAttribute(titleTextSetting, new BaseContent(''))
			);
			attributes.push(
				new CollectionAttribute(postContentSetting, new BaseContent(''))
			);
			attributes.push(
				new CollectionAttribute(commentSetting, commentContent)
			);
			attributes.push(
				new CollectionAttribute(reactionSetting, reactionContent)
			);
		}

		const updatedCollection = await this.postsRepository.insertPost(
			form.ref,
			post
		);

		if (!updatedCollection) {
			throw new DocumentReadError({
				message: 'Post collection not found',
				query: { slug: form.ref }
			});
		}

		return updatedCollection;
	}

	public async createPostsCollection(
		username: string,
		form: CollectionForm,
		slug?: string
	): Promise<Collection> {
		const postsCollection = new Collection(username, form);
		postsCollection.slug = slug ?? postsCollection.slug;
		postsCollection.attributes = [];

		const newPostsCollection =
			await this.postsRepository.createPostsCollection(postsCollection);

		if (!newPostsCollection) {
			throw new DocumentReadError({
				message: 'Posts collection not found',
				query: { slug: form.ref }
			});
		}

		await this.endpointService.createEndpoint(
			username,
			'collections/posts/' + form.info.subdirectory,
			newPostsCollection.slug
		);

		return newPostsCollection;
	}

	public async findPostsCollections(username: string): Promise<Collection[]> {
		const collections =
			await this.postsRepository.findPostsCollectionsByUsername(username);

		if (!collections) {
			throw new DocumentReadError({
				message: 'Collections not found',
				query: { username }
			});
		}

		return collections;
	}

	public async findPosts(slug: string): Promise<Collection[] | null> {
		const collection = await this.postsRepository.findPostsCollection(slug);

		const postSlugs: string[] = [];
		const posts: Collection[] = [];

		if (!collection) {
			throw new DocumentReadError({
				message: 'Collection not found',
				query: { slug }
			});
		}

		if (collection.attributes.length > 0) {
			for (const attribute of collection.attributes as CollectionAttribute[]) {
				if (attribute.setting.type === 'post') {
					postSlugs.push(attribute.content.value as string);
				}
			}

			posts.push(
				...(await this.collectionRepository.findBySlugs(postSlugs))
			);
		}
		return posts;
	}
}
