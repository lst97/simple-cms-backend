import yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import EnvFileChecker from '../utils/FileChecker';
import deasync from 'deasync';
export interface IAppConfig {
	port: number;
	host: string;
	protocol: string;
	apiVersion: string;
	apiEndpoint: string;
	database: {
		mongodbConnectionString: string;
		sqlite3ConnectionString: string;
	};
	certificates: {
		privateKey: string;
		certificate: string;
		ca: string;
	};
	appIdentifier: {
		name: string;
	};
	environment: string;
}

class AppConfig implements IAppConfig {
	port: number;
	host: string;
	protocol: string;
	apiVersion: string;
	apiEndpoint: string;
	database: {
		mongodbConnectionString: string;
		sqlite3ConnectionString: string;
	};
	certificates: {
		privateKey: string;
		certificate: string;
		ca: string;
	};
	appIdentifier: {
		name: string;
	};
	environment: string;

	constructor(configData: any) {
		const checker = new EnvFileChecker();

		let done = false;
		checker.checkEnvFile().then(() => (done = true));
		deasync.loopWhile(() => !done);

		this.port = configData.port;
		this.host = configData.host;
		this.apiVersion = configData.apiVersion;
		this.apiEndpoint = configData.apiEndpoint;
		this.database =
			process.env.ENVIRONMENT === 'docker'
				? 'mongodb://mongo:27017/simple-cms'
				: configData.database;
		this.certificates = configData.certificates;
		this.appIdentifier = configData.appIdentifier;
		this.environment = configData.environment;
		this.protocol = configData.protocol;
	}
}

const configPath = path.resolve(__dirname, 'app_config.yml');
const configData = yaml.parse(fs.readFileSync(configPath, 'utf8'));

const appConfig = new AppConfig(configData);

export default appConfig;
