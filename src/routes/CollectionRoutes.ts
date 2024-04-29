import express from 'express';
import { inject, injectable } from 'inversify';
import CollectionController, {
	ICollectionController
} from '../controllers/collection/CollectionController';
import IBaseRoutes from './IBaseRoutes';
import passport from 'passport';
@injectable()
class CollectionRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(CollectionController)
		private collectionController: ICollectionController
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	public configureRoutes(): void {
		this.router.post(
			'/collections',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.createCollection(req, res);
			}
		);

		this.router.get(
			'/collections',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollections(req, res);
			}
		);

		this.router.get(
			'/:username/collections/:prefix',
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollectionsByPrefixAndUsername(
					req,
					res
				);
			}
		);

		this.router.get(
			'/collections/:prefix/:slug',
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollections(req, res);
			}
		);

		this.router.get(
			'/collections/:slug',
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollectionBySlug(req, res);
			}
		);

		this.router.put(
			'/collections/:slug',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.updateCollectionAttributesContent(
					req,
					res
				);
			}
		);
	}
}

export default CollectionRoutes;
