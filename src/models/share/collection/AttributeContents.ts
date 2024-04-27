import { getModelForClass, prop } from '@typegoose/typegoose';

export class BaseContent {
	@prop({ required: false })
	public value?: string;

	constructor(content?: string) {
		this.value = content;
	}
}

export const BaseContentModel = getModelForClass(BaseContent);
