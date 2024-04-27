import { useInversify as useCommonResponseInversify } from '@lst97/common_response';
import { useInversify as useCommonMiddlewaresInversify } from '@lst97/express-common-middlewares';
import { Container } from 'inversify';
import {
	DatabaseService,
	MongoDBQueryService,
	SQLite3QueryService
} from './services/DatabaseService';
import CollectionController from './controllers/collection/CollectionController';
import CollectionRoutes from './routes/CollectionRoutes';
import CollectionService from './services/collection/CollectionService';
import CollectionRepository from './repositories/collection/CollectionRepository';
import AuthenticateRoutes from './routes/AuthenticateRoutes';
import UserRoutes from './routes/UserRoutes';
import AuthenticateController from './controllers/auth/AuthenticateController';
import UserController from './controllers/user/UserController';
import AuthenticateService from './services/auth/AuthenticateService';
import UserService from './services/UserService';
import { AuthUserRepository } from './repositories/auth/AuthUserRepository';
import { UserRepository } from './repositories/user/UserRepository';
import EndpointService from './services/endpoint/EndpointService';
import EndpointRepository from './repositories/endpoint/EndpointRepository';

const container = new Container();
function buildLibContainers() {
	useCommonResponseInversify(container);
	useCommonMiddlewaresInversify(container);
}

function buildRepositoryContainers() {
	container.bind(CollectionRepository).toSelf().inTransientScope();
	container.bind(AuthUserRepository).toSelf().inTransientScope();
	container.bind(UserRepository).toSelf().inTransientScope();
	container.bind(EndpointRepository).toSelf().inTransientScope();
}

function buildServiceContainers() {
	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(SQLite3QueryService).toSelf().inSingletonScope();
	container.bind(MongoDBQueryService).toSelf().inSingletonScope();

	container.bind(CollectionService).toSelf().inTransientScope();
	container.bind(AuthenticateService).toSelf().inTransientScope();
	container.bind(UserService).toSelf().inTransientScope();
	container.bind(EndpointService).toSelf().inTransientScope();
}

function buildControllerContainers() {
	container.bind(CollectionController).toSelf().inTransientScope();
	container.bind(AuthenticateController).toSelf().inTransientScope();
	container.bind(UserController).toSelf().inTransientScope();
}

function buildMiddlewareContainers() {}

function buildRouterContainers() {
	container.bind(CollectionRoutes).toSelf().inSingletonScope();
	container.bind(AuthenticateRoutes).toSelf().inSingletonScope();
	container.bind(UserRoutes).toSelf().inSingletonScope();
}

function buildAppContainers() {
	buildLibContainers();
	buildRepositoryContainers();
	buildServiceContainers();
	buildControllerContainers();
	buildMiddlewareContainers();
	buildRouterContainers();
}

buildAppContainers();

export default container;
