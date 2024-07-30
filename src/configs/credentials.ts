import fs from 'fs';
import AppConfig, { IAppConfig } from './config';

class Credentials {
	private _appConfig: IAppConfig = AppConfig.instance;

	public readonly tls = {
		key: fs.readFileSync(this._appConfig.certificates.privateKey, 'utf8'),
		cert: fs.readFileSync(this._appConfig.certificates.certificate, 'utf8'),
		ca: fs.readFileSync(this._appConfig.certificates.ca, 'utf8')
	};
}

export default Credentials;
