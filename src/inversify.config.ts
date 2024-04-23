import { useInversify as useCommonResponseInversify } from '@lst97/common_response';
import { useInversify as useCommonMiddlewaresInversify } from '@lst97/express-common-middlewares';
import { Container } from 'inversify';
import { DatabaseService } from './services/DatabaseService';
import CollectionController from './controllers/collection/CollectionController';
import CollectionRoutes from './routes/CollectionRoutes';
import CollectionService from './services/collection/CollectionService';
import CollectionRepository from './repositories/collection/CollectionRepository';

const container = new Container();
function buildLibContainers() {
	useCommonResponseInversify(container);
	useCommonMiddlewaresInversify(container);
}

function buildRepositoryContainers() {
	container.bind(CollectionRepository).toSelf().inTransientScope();
}

function buildServiceContainers() {
	container.bind(DatabaseService).toSelf().inSingletonScope();

	container.bind(CollectionService).toSelf().inTransientScope();
}

function buildControllerContainers() {
	container.bind(CollectionController).toSelf().inTransientScope();
}

function buildMiddlewareContainers() {}

function buildRouterContainers() {
	container.bind(CollectionRoutes).toSelf().inSingletonScope();
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
