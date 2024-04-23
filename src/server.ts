import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import appConfig, { IAppConfig } from './configs/config';
import Credentials from './configs/credentials';
import https from 'https';
import { Config as CommonResponseConfig } from '@lst97/common_response';
import {
	IRequestHeaderMiddlewareService,
	IResponseLoggerMiddlewareService,
	RequestHeaderMiddlewareConfig,
	RequestHeaderMiddlewareService,
	RequestLoggerMiddlewareService,
	ResponseLoggerMiddlewareService
} from '@lst97/express-common-middlewares';
import { injectable } from 'inversify';
import container from './inversify.config';
import CollectionRoutes, { ICollectionRoutes } from './routes/CollectionRoutes';

@injectable()
class App {
	private app: express.Application;
	private appConfig: IAppConfig;

	public get Config(): IAppConfig {
		return this.appConfig;
	}

	constructor() {
		this.app = express();
		this.appConfig = appConfig;
		this.config();
		this.routes();
	}

	public getApp(): express.Application {
		return this.app;
	}

	private config(): void {
		CommonResponseConfig.instance.idIdentifier =
			appConfig.appIdentifier.name;
		CommonResponseConfig.instance.requestIdName = 'requestId';
		CommonResponseConfig.instance.traceIdName = 'traceId';
		RequestHeaderMiddlewareConfig.instance.requestIdName = 'requestId';
		RequestHeaderMiddlewareConfig.instance.appIdentifier =
			appConfig.appIdentifier.name;

		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(
			container.get<IRequestHeaderMiddlewareService>(
				RequestHeaderMiddlewareService
			).requestId
		);
		this.app.use(
			container.get<RequestLoggerMiddlewareService>(
				RequestLoggerMiddlewareService
			).requestLogger
		);
		this.app.use(
			container.get<IResponseLoggerMiddlewareService>(
				ResponseLoggerMiddlewareService
			).responseLogger
		);
	}

	private routes(): void {
		this.app.use(
			`${appConfig.apiEndpoint}/${appConfig.apiVersion}`,
			container.get<ICollectionRoutes>(CollectionRoutes).routers
		);
	}

	public listen(port: number, callback: () => void): void {
		if (this.appConfig.environment === 'production') {
			const httpsServer = https.createServer(
				new Credentials().tls,
				this.app
			);
			httpsServer.listen(`${appConfig.port}`, callback);
		} else if (this.appConfig.environment === 'development') {
			this.app.listen(port, callback);
		} else {
			throw new Error('Environment not set');
		}
	}
}

const app = new App();
const port = app.Config.port;
const environment = app.Config.environment;
app.listen(port, () => {
	console.log(
		`(${environment}) Server is running on ${app.Config.protocol}://${app.Config.host}:${port} 🚀`
	);
});
