import express from 'express';
import { inject, injectable } from 'inversify';
import IBaseRoutes from './IBaseRoutes';
import EndpointController from '../controllers/endpoint/EndpointController';

@injectable()
class EndpointRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(EndpointController)
		private endpointController: EndpointController
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes(): void {
		this.router.get(
			'/endpoints/:slug',
			(req: express.Request, res: express.Response) => {
				this.endpointController.getEndpointByCollectionSlug(req, res);
			}
		);
	}
}

export default EndpointRoutes;
