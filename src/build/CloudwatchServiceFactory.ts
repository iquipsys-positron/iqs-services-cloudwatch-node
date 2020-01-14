import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CloudwatchController } from '../logic/CloudwatchController';
import { CloudwatchHttpServiceV1 } from '../services/version1/CloudwatchHttpServiceV1';

export class CloudwatchServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-cloudwatch", "factory", "default", "default", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-cloudwatch", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-cloudwatch", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(CloudwatchServiceFactory.ControllerDescriptor, CloudwatchController);
		this.registerAsType(CloudwatchServiceFactory.HttpServiceDescriptor, CloudwatchHttpServiceV1);
	}
	
}
