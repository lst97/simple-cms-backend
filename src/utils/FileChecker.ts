import * as fs from 'fs';
import * as path from 'path';

class EnvFileChecker {
	private readonly maxAttempts = 3;
	private readonly delayMs = 1000;

	private waitForEnvFile(): Promise<void> {
		console.log('Checking for .env file...');
		return new Promise((resolve, reject) => {
			let attempts = 0;

			const checkFile = () => {
				if (this.envFileExists()) {
					resolve();
				} else {
					attempts++;
					if (attempts < this.maxAttempts) {
						setTimeout(checkFile, this.delayMs);
					} else {
						reject(new Error('.env file not found'));
					}
				}
			};

			checkFile();
		});
	}

	private envFileExists(): boolean {
		const envPath = path.resolve(__dirname, '..', '..', '.env');
		return fs.existsSync(envPath);
	}

	public async checkEnvFile(): Promise<boolean> {
		try {
			await this.waitForEnvFile();
			return true;
		} catch (error: any) {
			console.error('Error:', error.message);
			process.exit(1);
		}
	}
}

export default EnvFileChecker;
