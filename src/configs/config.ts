import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

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
	private static _instance: AppConfig | null = null;

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

	private constructor(configData: any) {
		this.port = configData.port;
		this.host = configData.host;
		this.apiVersion = configData.apiVersion;
		this.apiEndpoint = configData.apiEndpoint;
		this.database =
			process.env.ENVIRONMENT === 'docker'
				? {
						mongodbConnectionString:
							'mongodb://mongo:27017/simple-cms',
						sqlite3ConnectionString:
							configData.database.sqlite3ConnectionString
				  }
				: configData.database;
		this.certificates = configData.certificates;
		this.appIdentifier = configData.appIdentifier;
		this.environment = configData.environment;
		this.protocol = configData.protocol;
	}

	public static get instance(): AppConfig {
		if (!AppConfig._instance) {
			const configPath = path.resolve(__dirname, 'app_config.yml');
			const configData = yaml.parse(fs.readFileSync(configPath, 'utf8'));
			AppConfig._instance = new AppConfig(configData);
		}
		return AppConfig._instance;
	}
}

export default AppConfig;
