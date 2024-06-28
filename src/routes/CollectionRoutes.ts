import express from 'express';
import { inject, injectable } from 'inversify';
import CollectionController, {
	ICollectionController
} from '../controllers/collection/CollectionController';
import IBaseRoutes from './IBaseRoutes';
import passport from 'passport';
import {
	IStorageManagerService,
	StorageManagerService
} from '../services/StorageManagerService';
@injectable()
class CollectionRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(CollectionController)
		private collectionController: ICollectionController,
		@inject(StorageManagerService)
		private storageManagerService: IStorageManagerService
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	public configureRoutes(): void {
		// For CMS frontend
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

		// can update settings or attributes or collection
		this.router.put(
			'/collections/:slug',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.updateCollection(req, res);
			}
		);

		this.router.post(
			'/collections/:slug/attribute',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.addCollectionAttribute(req, res);
			}
		);

		/**
		 * Update one attribute of a collection.
		 *
		 * @param {string} id - The id of the attribute.
		 * @param {string} slug - The slug of the collection.
		 * @query {setting} boolean - Indicates to update the setting of the attribute.
		 * @query {content} boolean - Indicates to update the attribute content.
		 */
		this.router.put(
			'/collections/:slug/attributes/:id',
			passport.authenticate('jwt', {
				session: false
			}),
			this.storageManagerService.upload.array('value', 32),
			(req: express.Request, res: express.Response) => {
				this.collectionController.updateCollectionAttribute(req, res);
			}
		);

		// update collection attributes
		this.router.put(
			'/collections/:slug/attributes',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.updateCollectionAttributes(req, res);
			}
		);

		this.router.delete(
			'/collections/:slug/attributes/:id',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.deleteCollectionAttribute(req, res);
			}
		);

		this.router.delete(
			'/collections/:slug',
			passport.authenticate('jwt', {
				session: false
			}),
			(req: express.Request, res: express.Response) => {
				this.collectionController.deleteCollection(req, res);
			}
		);

		// Public accessible routes.
		this.router.get(
			'/:username/collections/*',
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollectionsByPrefixAndUsername(
					req,
					res
				);
			}
		);

		this.router.get(
			'/collections/:slug',
			(req: express.Request, res: express.Response) => {
				this.collectionController.getCollectionBySlug(req, res);
			}
		);
	}
}

export default CollectionRoutes;
