export interface RegistrationFormParams {
	email: string;
	password: string;
	username: string;
	image?: string;
}

export interface IRegistrationForm {
	email: string;
	password: string;
	username: string;
	image?: string;
}
export class RegistrationForm {
	email: string;
	password: string;
	username: string;
	image?: string;
	constructor({ email, password, username, image }: RegistrationFormParams) {
		this.email = email;
		this.password = password;
		this.username = username;
		this.image = image;
	}
}
