import { getModelForClass, prop } from '@typegoose/typegoose';
import {
	TextTypes,
	TextSchema,
	CodeSchema,
	MediaTypes,
	MediaExtensions,
	DocumentExtensions,
	DocumentSchema,
	DateFormats,
	NumberSchema,
	DecimalSchema,
	MediaSchema,
	DateSchema,
	TextContentTypes,
	CodeLanguageTypes
} from '../../../schemas/collection/BaseSchema';
import { Code, ObjectId } from 'mongodb';
import { SupportedAttributeTypes } from '../../../schemas/collection/CollectionBaseSchema';

export type SupportedAdvancedSettingTypes =
	| 'require' // 1
	| 'unique' // 2
	| 'max_length' // 4
	| 'min_length'; // 8

export class SupportedAdvancedSettings {
	static require: SupportedAdvancedSettingTypes = 'require';
	static unique: SupportedAdvancedSettingTypes = 'unique';
	static max_length: SupportedAdvancedSettingTypes = 'max_length';
	static min_length: SupportedAdvancedSettingTypes = 'min_length';
}

export type AttributeSettingTypes =
	| TextTypeSetting
	| CodeTypeSetting
	| MediaTypeSetting
	| DocumentTypeSetting
	| DateTypeSetting
	| DecimalTypeSetting
	| NumberTypeSetting
	| BooleanTypeSetting
	| DynamicTypeSetting;
interface TypeSettingProps {
	required?: boolean;
	unique?: boolean;
	isPrivate?: boolean;
}

interface TextTypeSettingProps extends TypeSettingProps {
	maxLength?: number;
	minLength?: number;
	textType?: TextContentTypes;
}

interface CodeTypeSettingProps extends TypeSettingProps {
	maxLength?: number;
	minLength?: number;
	language?: CodeLanguageTypes;
}

interface MediaTypeSettingProps extends TypeSettingProps {
	mediaType?: MediaTypes;
	mediaExtension?: MediaExtensions;
	maxSize?: number;
}

interface DocumentTypeSettingProps extends TypeSettingProps {
	documentExtension?: DocumentExtensions;
	maxSize?: number;
}

interface DateTypeSettingProps extends TypeSettingProps {
	format?: DateFormats;
}

interface NumberTypeSettingProps extends TypeSettingProps {
	min?: number;
	max?: number;
}

interface DecimalTypeSettingProps extends TypeSettingProps {
	min?: number;
	max?: number;
	precision?: [number, number];
}

interface DynamicTypeSettingProps extends TypeSettingProps {
	content?: unknown;
}

export class TypeSetting {
	@prop({ required: false, default: new ObjectId() })
	public _id!: ObjectId;

	@prop({ required: true })
	public name!: string;
	@prop({ required: true })
	public type!: SupportedAttributeTypes;
	@prop({ required: true, default: false })
	public required: boolean;
	@prop({ required: true, default: false })
	public unique: boolean;
	@prop({ required: true, default: false })
	public private: boolean;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps
	) {
		this.name = name;
		this.type = type;
		this.required = required;
		this.unique = unique;
		this.private = isPrivate;
	}
}

export class TextTypeSetting extends TypeSetting {
	@prop({ required: true })
	public maxLength: number;
	@prop({ required: true })
	public minLength: number;
	@prop({ required: true })
	public textType: TextContentTypes;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			maxLength = TextSchema.maxLength,
			minLength = TextSchema.minLength,
			textType = 'short_text'
		}: TextTypeSettingProps
	) {
		super(name, 'text', { required, unique, isPrivate });
		this.maxLength = maxLength;
		this.minLength = minLength;
		this.textType = textType;
	}
}

export class CodeTypeSetting extends TypeSetting {
	@prop({ required: true })
	public maxLength: number;
	@prop({ required: true })
	public minLength: number;
	@prop({ required: true })
	public language: CodeLanguageTypes;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			maxLength = TextSchema.maxLength,
			minLength = TextSchema.minLength,
			language = 'plaintext'
		}: CodeTypeSettingProps
	) {
		super(name, 'code', { required, unique, isPrivate });
		this.maxLength = maxLength;
		this.minLength = minLength;
		this.language = language;
	}
}

export interface ImageMetadataProps {
	id: string;
	altText: string;
	title?: string;
	caption?: string;
	description?: string;
	fileName: string;
	fileSize: number;
	dimensions?: {
		width: number;
		height: number;
	};
	usageRights?: string;
	creator: string;
}

export class ImageMetadata {
	id: string; // Unique identifier
	altText: string; // Alternative text for accessibility
	title?: string; // Optional title for the image
	caption?: string; // Optional caption for the image
	description?: string; // Optional longer description
	fileName: string; // Original file name
	fileSize: number; // File size in bytes
	dimensions?: {
		width: number; // Image width in pixels
		height: number; // Image height in pixels
	};
	usageRights?: string; // Information about usage rights
	creator: string; // Creator/author of the image

	constructor({
		id,
		altText,
		title,
		caption,
		description,
		fileName,
		fileSize,
		dimensions,
		usageRights,
		creator
	}: ImageMetadataProps) {
		this.id = id;
		this.altText = altText;
		this.title = title;
		this.caption = caption;
		this.description = description;
		this.fileName = fileName;
		this.fileSize = fileSize;
		this.dimensions = dimensions;
		this.usageRights = usageRights;
		this.creator = creator;
	}
}

export class MediaTypeSetting extends TypeSetting {
	@prop({ required: true })
	public mediaType: MediaTypes;
	@prop({ required: true })
	public mediaExtension: MediaExtensions;
	@prop({ required: true })
	public maxSize: number; // bytes

	// content related
	@prop({ required: false, default: [] })
	public metadata?: ImageMetadata[];

	constructor(
		name: string,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			mediaType = MediaSchema.mediaType,
			mediaExtension = MediaSchema.extension,
			maxSize = MediaSchema.maxSize
		}: MediaTypeSettingProps
	) {
		super(name, 'media', { required, unique, isPrivate });
		this.mediaType = mediaType;
		this.mediaExtension = mediaExtension;
		this.maxSize = maxSize;
	}
}

export class DocumentTypeSetting extends TypeSetting {
	@prop({ required: true })
	public documentExtension: DocumentExtensions;
	@prop({ required: true })
	public maxSize: number;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			documentExtension = DocumentSchema.extension,
			maxSize = DocumentSchema.maxSize
		}: DocumentTypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
		this.documentExtension = documentExtension;
		this.maxSize = maxSize;
	}
}

export class DateTypeSetting extends TypeSetting {
	@prop({ required: true })
	public format: DateFormats;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{ format = DateSchema.format }: DateTypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
		this.format = format;
	}
}

export class NumberTypeSetting extends TypeSetting {
	@prop({ required: true })
	public min: number;
	@prop({ required: true })
	public max: number;

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			min = NumberSchema.min,
			max = NumberSchema.max
		}: NumberTypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
		this.min = min;
		this.max = max;
	}
}

export class DecimalTypeSetting extends TypeSetting {
	@prop({ required: true })
	public min: number;
	@prop({ required: true })
	public max: number;
	@prop({ required: true })
	public precision: [number, number];

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{
			min = DecimalSchema.min,
			max = DecimalSchema.max,
			precision = DecimalSchema.precision
		}: DecimalTypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
		this.min = min;
		this.max = max;
		this.precision = precision;
	}
}

export class BooleanTypeSetting extends TypeSetting {
	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
	}
}

export class DynamicTypeSetting extends TypeSetting {
	@prop({ required: true })
	public content: unknown = {};

	constructor(
		name: string,
		type: SupportedAttributeTypes,
		{
			required = false,
			unique = false,
			isPrivate = false
		}: TypeSettingProps,
		{ content }: DynamicTypeSettingProps
	) {
		super(name, type, { required, unique, isPrivate });
		this.content = content;
	}
}

export const TypeSettingModel = getModelForClass(TypeSetting);
export const TextTypeSettingModel = getModelForClass(TextTypeSetting);
export const MediaTypesSettingModel = getModelForClass(MediaTypeSetting);
