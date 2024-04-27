export interface ILoginFormParams {
	email: string;
	password: string;
}

export interface ILoginForm {
	email: string;
	password: string;
}
export class LoginForm implements ILoginForm {
	email: string;
	password: string;

	constructor({ email, password }: ILoginFormParams) {
		this.email = email;
		this.password = password;
	}
}
