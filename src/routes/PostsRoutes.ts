import express from 'express';
import { inject, injectable } from 'inversify';
import IBaseRoutes from './IBaseRoutes';
import PostsController from '../controllers/collection/PostsController';

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
			'/posts/*',
			(req: express.Request, res: express.Response) => {
				this.postsController.getPostsCollection(req, res);
			}
		);
	}
}

export default PostsRoutes;
