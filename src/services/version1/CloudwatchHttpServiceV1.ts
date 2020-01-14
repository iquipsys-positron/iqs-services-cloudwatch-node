import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class CloudwatchHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/cloudwatch');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-cloudwatch', 'controller', 'default', '*', '1.0'));
    }
}