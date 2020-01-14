"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const CloudwatchController_1 = require("../logic/CloudwatchController");
const CloudwatchHttpServiceV1_1 = require("../services/version1/CloudwatchHttpServiceV1");
class CloudwatchServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CloudwatchServiceFactory.ControllerDescriptor, CloudwatchController_1.CloudwatchController);
        this.registerAsType(CloudwatchServiceFactory.HttpServiceDescriptor, CloudwatchHttpServiceV1_1.CloudwatchHttpServiceV1);
    }
}
exports.CloudwatchServiceFactory = CloudwatchServiceFactory;
CloudwatchServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-cloudwatch", "factory", "default", "default", "1.0");
CloudwatchServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-cloudwatch", "controller", "default", "*", "1.0");
CloudwatchServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-cloudwatch", "service", "http", "*", "1.0");
//# sourceMappingURL=CloudwatchServiceFactory.js.map