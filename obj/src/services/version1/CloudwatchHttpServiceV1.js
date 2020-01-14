"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class CloudwatchHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/cloudwatch');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-cloudwatch', 'controller', 'default', '*', '1.0'));
    }
}
exports.CloudwatchHttpServiceV1 = CloudwatchHttpServiceV1;
//# sourceMappingURL=CloudwatchHttpServiceV1.js.map