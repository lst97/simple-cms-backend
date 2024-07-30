import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
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
import CollectionRoutes from './routes/CollectionRoutes';
import { ServerInvalidEnvConfigError } from '@lst97/common-errors';
import IBaseRoutes from './routes/IBaseRoutes';
import AuthenticateRoutes from './routes/AuthenticateRoutes';
import UserRoutes from './routes/UserRoutes';
import PassportConfig from './configs/Passport.config';
import EndpointRoutes from './routes/EndpointRoutes';
import StorageRoutes from './routes/StorageRoutes';
import PostsRoutes from './routes/PostsRoutes';
import AppConfig, { IAppConfig } from './configs/config';
@injectable()
class App {
	private app: express.Application;
	private appConfig!: IAppConfig; // init in config()

	public get Config(): IAppConfig {
		return this.appConfig;
	}

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	public getApp(): express.Application {
		return this.app;
	}

	private config(): void {
		this.appConfig = AppConfig.instance;

		if (!process.env.ACCESS_TOKEN_SECRET) {
			throw new ServerInvalidEnvConfigError({
				message: 'ACCESS_TOKEN_SECRET is not set in .env file.'
			});
		}

		CommonResponseConfig.instance.idIdentifier =
			this.appConfig.appIdentifier.name;
		CommonResponseConfig.instance.requestIdName = 'requestId';
		CommonResponseConfig.instance.traceIdName = 'traceId';
		RequestHeaderMiddlewareConfig.instance.requestIdName = 'requestId';
		RequestHeaderMiddlewareConfig.instance.appIdentifier =
			this.appConfig.appIdentifier.name;

		this.app.use(helmet());
		this.app.use(
			cors({
				origin: true,
				credentials: true,
				allowedHeaders: ['Content-Type', 'Authorization'],
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				optionsSuccessStatus: 200
			})
		);
		this.app.use(express.json());
		this.app.use(PassportConfig.instance.init());

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
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(CollectionRoutes).routers
		);

		this.app.use(
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(PostsRoutes).routers
		);

		this.app.use(
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(AuthenticateRoutes).routers
		);

		this.app.use(
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(UserRoutes).routers
		);

		this.app.use(
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(EndpointRoutes).routers
		);

		this.app.use(
			`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`,
			container.get<IBaseRoutes>(StorageRoutes).routers
		);
	}

	public listen(port: number, callback: () => void): void {
		switch (this.appConfig.environment) {
			case 'production': {
				const httpsServer = https.createServer(
					new Credentials().tls,
					this.app
				);
				httpsServer.listen(port, callback);
				break;
			}
			case 'local': // development
				this.app.listen(port, callback);
				break;
			case 'docker': // testing
				this.app.listen(port, callback);
				break;
			default:
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
