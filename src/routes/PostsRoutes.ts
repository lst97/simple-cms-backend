import express from 'express';
import { inject, injectable } from 'inversify';
import IBaseRoutes from './IBaseRoutes';
import PostsController from '../controllers/collection/PostsController';
import passport from 'passport';

@injectable()
class PostsRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(PostsController)
		private postsController: PostsController
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes(): void {
		this.router.get(
			'/collections/posts/*',
			(req: express.Request, res: express.Response) => {
				this.postsController.getPostsByPostsCollectionSlug(req, res);
			}
		);

		this.router.post(
			'/collections/posts',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.postsController.createPostsCollection(req, res);
			}
		);

		this.router.post(
			'/posts/:slug',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.postsController.createPost(req, res);
			}
		);
	}
}

export default PostsRoutes;
