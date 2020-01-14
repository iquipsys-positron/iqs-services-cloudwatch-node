import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { CloudwatchServiceFactory } from '../build/CloudwatchServiceFactory';

export class CloudwatchProcess extends ProcessContainer {

    public constructor() {
        super("cloudwatch", "AWS Cloudwatch microservice");
        this._factories.add(new CloudwatchServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
