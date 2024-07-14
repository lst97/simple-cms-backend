import { inject, injectable } from 'inversify';
import { DocumentReadError } from '../../errors/Errors';
import { CollectionForm } from '../../models/forms/CollectionForm';
import { Collection } from '../../models/share/collection/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';
import {
	AttributeSettingTypes,
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
import { ValidationError } from '@lst97/common-errors';
import CollectionService from '../collection/CollectionService';

@injectable()
export class PostsService {
	constructor(
		@inject(CollectionService)
		private collectionService: CollectionService,
		@inject(PostsRepository)
		private postsRepository: PostsRepository,
		@inject(EndpointService)
		private endpointService: IEndpointService
	) {}

	public async createPost(
		username: string,
		form: CollectionForm,
		slug?: string // posts collection slug
	): Promise<Collection> {
		if (slug) {
			const postsCollection =
				await this.postsRepository.findPostsCollection(slug);

			if (!postsCollection) {
				throw new DocumentReadError({
					message: 'Posts collection not found',
					query: { slug }
				});
			}

			// validate if frontend provide valid attributes for post
			// should have Title, Content, optional: Comment, Reaction
			const postAttributes =
				form.attributes as unknown as CollectionAttribute[];
			const title = postAttributes.find(
				(attribute) =>
					attribute.setting.type === 'text' &&
					attribute.setting.name === 'Title'
			);

			const content = postAttributes.find(
				(attribute) =>
					attribute.setting.type === 'text' &&
					attribute.setting.name === 'Content'
			);

			if (!title || !content) {
				throw new ValidationError({
					message: 'Post should have title and content'
				});
			}

			// TODO: check comment and reaction

			// Step 1: Create collection
			// Step 2: Update Posts collection with new post slug
			const post = new Collection(username, form);
			const newPost = await this.collectionService.create(form, username);

			await this.postsRepository.insertPost(slug, newPost);
		} else {
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
				...(await this.collectionService.findCollectionsBySlugs(
					postSlugs
				))
			);
		}
		return posts;
	}
}
