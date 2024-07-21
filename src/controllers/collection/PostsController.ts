import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { DefinedBaseError, ControllerError } from '@lst97/common-errors';
import {
	ErrorHandlerService,
	IErrorHandlerService,
	ResponseService,
	IResponseService
} from '@lst97/common_response';
import CollectionController from '../collection/CollectionController';
import { PostsService } from '../../services/post/PostsService';
import { User } from '../../models/database/User';

@injectable()
class PostsController {
	constructor(
		@inject(PostsService) private postsService: PostsService,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService,
		@inject(ResponseService) private responseService: IResponseService
	) {}

	public async getPostsByPostsCollectionSlug(req: Request, res: Response) {
		const prefix = req.params[0];
		const slug = prefix.split('/')[-1] ?? prefix;

		try {
			const postsModel = await this.postsService.findPosts(slug);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async createPost(req: Request, res: Response) {
		const postsCollectionSlug = req.params.slug;
		const form = req.body;
		const username = (req.user as User).username;

		try {
			const postsModel = await this.postsService.createPost(
				username,
				form,
				postsCollectionSlug
			);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async getPost(req: Request, res: Response) {
		const slug = req.params.slug;

		try {
			const postsModel = await this.postsService.findPost(slug);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async getPostsCollections(req: Request, res: Response) {
		const username = (req.user as User).username;

		try {
			const postsModel = await this.postsService.findPostsCollections(
				username
			);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async createPostsCollection(req: Request, res: Response) {
		const form = req.body;
		const username = (req.user as User).username;

		try {
			const postsModel = await this.postsService.createPostsCollection(
				username,
				form
			);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async deletePost(req: Request, res: Response) {
		const slug = req.params.slug;

		try {
			const postsModel = await this.postsService.deletePost(slug);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async updatePost(req: Request, res: Response) {
		const slug = req.params.slug;
		const form = req.body;

		try {
			const postsModel = await this.postsService.updatePost(slug, form);

			const commonResponse = this.responseService.buildSuccessResponse(
				postsModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}
}

export default PostsController;
