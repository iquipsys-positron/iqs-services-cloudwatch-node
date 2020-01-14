"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
class CloudwatchCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeGetLogGroupsCommand());
        this.addCommand(this.makeGetLogStreamsCommand());
        this.addCommand(this.makeGetLogEventsCommand());
        this.addCommand(this.makeGetMetricsCommand());
    }
    makeGetLogGroupsCommand() {
        return new pip_services3_commons_node_2.Command("get_log_groups", new pip_services3_commons_node_3.ObjectSchema(true)
            .withOptionalProperty("name_prefix", pip_services3_commons_node_4.TypeCode.String)
            .withOptionalProperty("limit", pip_services3_commons_node_4.TypeCode.Integer), (correlationId, args, callback) => {
            let namePrefix = args.get("name_prefix");
            let limit = args.get("limit");
            this._logic.getLogGroups(correlationId, namePrefix, limit, callback);
        });
    }
    makeGetLogStreamsCommand() {
        return new pip_services3_commons_node_2.Command("get_log_streams", new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_4.TypeCode.String)
            .withOptionalProperty("stream_prefix", pip_services3_commons_node_4.TypeCode.String)
            .withOptionalProperty("limit", pip_services3_commons_node_4.TypeCode.Integer), (correlationId, args, callback) => {
            let group = args.get("group");
            let streamPrefix = args.get("stream_prefix");
            let limit = args.get("limit");
            this._logic.getLogStreams(correlationId, group, streamPrefix, limit, callback);
        });
    }
    makeGetLogEventsCommand() {
        return new pip_services3_commons_node_2.Command("get_logs", new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("stream", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("start_time", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("end_time", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("filter", pip_services3_commons_node_4.TypeCode.String)
            .withOptionalProperty("limit", pip_services3_commons_node_4.TypeCode.Integer), (correlationId, args, callback) => {
            let group = args.get("group");
            let stream = args.get("stream");
            let startTime = new Date(args.get("start_time"));
            let endTime = new Date(args.get("end_time"));
            let filter = args.get("filter");
            let limit = args.get("limit");
            this._logic.getLogEvents(correlationId, group, stream, startTime, endTime, filter, limit, callback);
        });
    }
    makeGetMetricsCommand() {
        return new pip_services3_commons_node_2.Command("get_metrics", new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty("namespace", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("start_time", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("end_time", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("period", pip_services3_commons_node_4.TypeCode.Integer)
            .withRequiredProperty("unit", pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty("type", pip_services3_commons_node_4.TypeCode.String)
            .withOptionalProperty("metric", pip_services3_commons_node_4.TypeCode.String), (correlationId, args, callback) => {
            let namespace = args.get("namespace");
            let startTime = new Date(args.get("start_time"));
            let endTime = new Date(args.get("end_time"));
            let period = args.get("period");
            let unit = args.get("unit");
            let type = args.get("type");
            let metric = args.get("metric");
            this._logic.getMetricData(correlationId, namespace, startTime, endTime, period, type, unit, metric, callback);
        });
    }
}
exports.CloudwatchCommandSet = CloudwatchCommandSet;
//# sourceMappingURL=CloudwatchCommandSet.js.map