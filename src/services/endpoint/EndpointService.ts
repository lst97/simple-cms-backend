import { inject, injectable } from 'inversify';
import {
	CollectionEndpoint,
	IEndpoint
} from '../../models/share/endpoint/Endpoint';
import EndpointRepository, {
	IEndpointRepository
} from '../../repositories/endpoint/EndpointRepository';
import { ServerResourceNotFoundError } from '@lst97/common-errors';

// TODO: should not be null, should be resource not found error
export interface IEndpointService {
	createEndpoint(
		username: string,
		prefix: string,
		slug: string
	): Promise<IEndpoint | null>;
	findEndpointBySlug(slug: string): Promise<IEndpoint | null>;
	findEndpointsByUsername(username: string): Promise<IEndpoint[] | null>;
	findSlugsByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility?: 'public' | 'private'
	): Promise<string[] | null>;
	deleteEndpointBySlug(username: string, slug: string): Promise<boolean>;
}

@injectable()
class EndpointService {
	constructor(
		@inject(EndpointRepository)
		private endpointRepository: IEndpointRepository
	) {}

	public async createEndpoint(
		username: string,
		prefix: string,
		slug: string
	): Promise<IEndpoint | null> {
		return await this.endpointRepository.createCollectionEndpoint(
			new CollectionEndpoint(username, {
				prefix: prefix,
				slug: slug,
				method: 'GET',
				status: 'published',
				visibility: 'public'
			})
		);
	}

	public async findEndpointBySlug(slug: string): Promise<IEndpoint | null> {
		const endpoint =
			await this.endpointRepository.findCollectionEndpointBySlug(slug);

		if (!endpoint) {
			throw new ServerResourceNotFoundError('Endpoint not found');
		}

		return endpoint;
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

	public async deleteEndpointBySlug(
		username: string,
		slug: string
	): Promise<boolean> {
		return await this.endpointRepository.deleteCollectionEndpointBySlug(
			username,
			slug
		);
	}
}

export default EndpointService;
