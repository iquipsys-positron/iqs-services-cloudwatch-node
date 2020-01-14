"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const CloudwatchServiceFactory_1 = require("../build/CloudwatchServiceFactory");
class CloudwatchProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("cloudwatch", "AWS Cloudwatch microservice");
        this._factories.add(new CloudwatchServiceFactory_1.CloudwatchServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.CloudwatchProcess = CloudwatchProcess;
//# sourceMappingURL=CloudwatchProcess.js.map