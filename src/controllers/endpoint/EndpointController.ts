import { inject, injectable } from 'inversify';
import EndpointService, {
	IEndpointService
} from '../../services/endpoint/EndpointService';
import { Request, Response } from 'express';
import { User } from '../../models/database/User';

@injectable()
class EndpointController {
	constructor(
		@inject(EndpointService) private endpointService: IEndpointService
	) {}
}

export default EndpointController;
