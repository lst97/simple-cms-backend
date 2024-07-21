import { inject, injectable } from 'inversify';
import {
	DocumentCreationError,
	DocumentDeletionError,
	DocumentReadError
} from '../../errors/Errors';
import { CollectionForm } from '../../models/forms/CollectionForm';
import {
	Collection,
	PostCollection
} from '../../models/share/collection/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';
import PostsRepository from '../../repositories/post/PostsRepository';
import EndpointService, { IEndpointService } from '../endpoint/EndpointService';
import { ValidationError } from '@lst97/common-errors';
import { PostTypeSetting } from '../../models/share/collection/AttributeTypeSettings';
import { BaseContent } from '../../models/share/collection/AttributeContents';

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

			form.ref = slug;
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

		const newPost = await this.collectionRepository.create(
			new PostCollection(username, form)
		);

		if (newPost) {
			if (slug) {
				const newPostsCollectionAttribute = new CollectionAttribute(
					newPost.setting as PostTypeSetting,
					new BaseContent(newPost.slug)
				);

				await this.postsRepository.insertPost(
					slug,
					newPostsCollectionAttribute
				);

				await this.endpointService.createEndpoint(
					username,
					'posts/' + form.info.subdirectory,
					newPost.slug
				);
			}

			return newPost;
		} else {
			throw new DocumentCreationError({
				message: 'Can not create post',
				query: { slug: form.ref }
			});
		}
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

	public async findPost(slug: string): Promise<Collection> {
		const post = await this.collectionRepository.findBySlug(slug);

		if (!post) {
			throw new DocumentReadError({
				message: 'Post not found',
				query: { slug }
			});
		}

		return post;
	}

	public async findPosts(slug: string): Promise<Collection[]> {
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

	public async deletePost(slug: string): Promise<Boolean> {
		const post = await this.collectionRepository.findBySlug(slug);

		if (!post) {
			throw new DocumentReadError({
				message: 'Post not found',
				query: { slug }
			});
		}

		// TODO: transaction
		// 1. delete endpoint
		if (!(await this.endpointService.deleteEndpointBySlug(post.slug))) {
			throw new DocumentDeletionError({
				message: 'Can not delete post',
				query: { slug }
			});
		}

		// 2. delete attribute from PostsCollection if exist (check ref)
		if (post.ref) {
			await this.postsRepository.deletePostsCollectionAttributeBySlug(
				post.ref,
				post.slug
			);
		}

		// 3. delete the actual post
		const deletedPost = await this.collectionRepository.delete(post._id!);

		if (!deletedPost) {
			throw new DocumentDeletionError({
				message: 'Can not delete post',
				query: { slug }
			});
		}

		return deletedPost;
	}

	public async updatePost(
		slug: string,
		form: CollectionForm
	): Promise<Collection> {
		const originPost = await this.collectionRepository.findBySlug(slug);

		if (!originPost) {
			throw new DocumentReadError({
				message: 'Post not found',
				query: { slug }
			});
		}

		// assign form value to origin post
		originPost.collectionName = form.info.name;

		return originPost;
	}
}
