import Joi from 'joi';
import { IBaseSchema } from './IBaseSchema';

export class AuthSchema implements IBaseSchema {
	static loginFormSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required().messages({
			'string.min': 'Invalid password'
		})
	});

	static registrationFormSchema = Joi.object({
		username: Joi.string().min(2).max(64).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required(),
		image: Joi.alternatives()
			.try(Joi.string().base64(), Joi.string().uri())
			.optional()
	});

	static urlParamSchema = Joi.object({});

	// weekViewId=14-2024
	static urlQuerySchema = Joi.object({});
}
