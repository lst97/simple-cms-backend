import { inject, injectable } from 'inversify';
import {
	CollectionEndpoint,
	IEndpoint,
	SupportedPrefixes
} from '../../models/share/endpoint/Endpoint';
import EndpointRepository, {
	IEndpointRepository
} from '../../repositories/endpoint/EndpointRepository';

export interface IEndpointService {
	createEndpoint(
		username: string,
		prefix: SupportedPrefixes,
		slug: string
	): Promise<IEndpoint | null>;
	findEndpointBySlug(slug: string): Promise<IEndpoint | null>;
	findEndpointsByUsername(username: string): Promise<IEndpoint[] | null>;
	findSlugsByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility?: 'public' | 'private'
	): Promise<string[] | null>;
}

@injectable()
class EndpointService {
	constructor(
		@inject(EndpointRepository)
		private endpointRepository: IEndpointRepository
	) {}

	public async createEndpoint(
		username: string,
		prefix: SupportedPrefixes,
		slug: string
	): Promise<IEndpoint | null> {
		switch (prefix) {
			case 'resources':
				return await this.endpointRepository.createCollectionEndpoint(
					new CollectionEndpoint(username, {
						slug: slug,
						method: 'GET',
						status: 'published',
						visibility: 'public'
					})
				);
			default:
				return null;
		}
	}

	public async findEndpointBySlug(slug: string): Promise<IEndpoint | null> {
		return await this.endpointRepository.findCollectionEndpointBySlug(slug);
	}

	public async findEndpointsByUsername(
		username: string
	): Promise<IEndpoint[] | null> {
		return await this.endpointRepository.findCollectionEndpointsByUsername(
			username
		);
	}

	public async findSlugsByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility: 'public' | 'private' = 'public'
	): Promise<string[] | null> {
		return (
			(
				await this.endpointRepository.findCollectionEndpointsByPrefixAndUsername(
					username,
					prefix,
					visibility
				)
			)?.map((endpoint) => endpoint.slug) ?? null
		);
	}
}

export default EndpointService;
