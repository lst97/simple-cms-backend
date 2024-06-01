import express from 'express';
import { inject, injectable } from 'inversify';
import IBaseRoutes from './IBaseRoutes';
import StorageController, {
	IStorageController
} from '../controllers/storage/StorageController';

@injectable()
class StorageRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(StorageController)
		private storageController: IStorageController
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes(): void {
		this.router.get(
			'/storage/:username/:fileId',
			(req: express.Request, res: express.Response) => {
				this.storageController.getFile(req, res);
			}
		);
	}
}

export default StorageRoutes;
