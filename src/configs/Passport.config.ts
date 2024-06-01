import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import container from '../inversify.config';
import UserService, { IUserService } from '../services/UserService';

class PassportConfig {
	private static _instance: PassportConfig;
	private static _opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.ACCESS_TOKEN_SECRET!
	};
	private constructor() {
		this.setup();
	}

	public get opts(): any {
		return PassportConfig._opts;
	}

	public set opts(opts: any) {
		PassportConfig._opts = opts;
		this.setup();
	}

	public static get instance(): PassportConfig {
		if (!PassportConfig._instance) {
			PassportConfig._instance = new PassportConfig();
		}

		return PassportConfig._instance;
	}

	private setup(): void {
		passport.use(
			new JwtStrategy(this.opts, async (jwt_payload, done) => {
				try {
					const user = await container
						.get<IUserService>(UserService)
						.getUserByEmail(jwt_payload.email);

					if (user) {
						return done(null, user);
					}

					return done(new Error('Email not found'), false);
				} catch (error) {
					return done(error, false);
				}
			})
		);
	}

	public init() {
		return passport.initialize();
	}
}

export default PassportConfig;
