import { getModelForClass, prop } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';

export interface AuthUserParams {
	id?: string;
	email: string;
	passwordHash: string;
}

export interface UserParams {
	username: string;
	email: string;
	image: string;
}

export interface IAuthUser {
	id?: string;
	email: string;
	passwordHash: string;
}

export interface IUser {
	username: string;
	email: string;
	image: string;
	createAt?: string;
	modifyAt?: string;
}

// SQLite Model (AuthUser)
export class AuthUserDbModel implements IAuthUser {
	id: string;
	email: string;
	passwordHash: string;

	constructor({ id, email, passwordHash }: AuthUserParams) {
		this.id = id ?? uuidv4();
		this.email = email;
		this.passwordHash = passwordHash;
	}
}

// MongoDB Model (User)
export class User implements IUser {
	@prop({ required: true })
	username!: string;
	@prop({ required: true })
	email!: string;
	@prop({ required: true })
	image!: string;
	@prop({ default: Date.now })
	createdAt!: Date;
	@prop({ default: Date.now })
	updatedAt!: Date;

	constructor({ username, email, image }: UserParams) {
		this.username = username;
		this.email = email;
		this.image = image;
	}
}

export const UserModel = getModelForClass(User);
