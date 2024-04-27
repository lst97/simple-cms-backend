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
			case '/collections':
				return await this.endpointRepository.createCollectionEndpoint(
					new CollectionEndpoint(username, {
						slug: slug,
						method: 'GET',
						status: 'published',
						visibility: 'public'
					})
				);
		}
	}

	public async findEndpointBySlug(slug: string): Promise<IEndpoint | null> {
		return await this.endpointRepository.findCollectionEndpointBySlug(slug);
	}
}

export default EndpointService;
