import express from 'express';
import { inject, injectable } from 'inversify';
import CollectionController, {
	ICollectionController
} from '../controllers/collection/CollectionController';

export interface ICollectionRoutes {
	routers: express.Router;
}

@injectable()
class CollectionRoutes implements ICollectionRoutes {
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
		this.router.post('/collections', (req, res) => {
			this.collectionController.createCollection(req, res);
		});
	}
}

export default CollectionRoutes;
