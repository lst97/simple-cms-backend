import { getModelForClass, prop } from '@typegoose/typegoose';
import { TextContent } from './AttributeContents';
import { TypeSetting } from './AttributeTypeSettings';

export class CollectionAttribute {
	@prop({ required: true })
	public setting: TypeSetting;
	@prop({ required: true })
	public content: TextContent;

	constructor(setting: TypeSetting, content: TextContent) {
		this.setting = setting;
		this.content = content;
	}
}

export const CollectionAttributeModel = getModelForClass(CollectionAttribute);
