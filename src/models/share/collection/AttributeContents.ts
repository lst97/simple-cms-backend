import { getModelForClass, prop } from '@typegoose/typegoose';

export class TextContent {
	@prop({ required: false })
	public content?: string;

	constructor(content?: string) {
		this.content = content;
	}
}

export const TextContentModel = getModelForClass(TextContent);
