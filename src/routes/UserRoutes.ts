import express from 'express';
import { inject, injectable } from 'inversify';
import UserController, {
	IUserController
} from '../controllers/user/UserController';
import IBaseRoutes from './IBaseRoutes';

@injectable()
class UserRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(UserController)
		private userController: IUserController
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes(): void {
		this.router.get('/user/:username', (req, res) =>
			this.userController.getUser(req, res)
		);
	}
}

export default UserRoutes;
