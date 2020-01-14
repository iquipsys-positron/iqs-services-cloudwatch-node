"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const CloudwatchCommandSet_1 = require("./CloudwatchCommandSet");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const CloudwatchScanBy_1 = require("../data/CloudwatchScanBy");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class CloudwatchController {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._opened = false;
        this._connectionResolver = new pip_services3_aws_node_1.AwsConnectionResolver();
        this._logsClient = null; //AmazonCloudWatchClient Logs
        this._metricsClient = null; //AmazonCloudWatchClient Metrics
        this._dependencyResolver = new pip_services3_commons_node_1.DependencyResolver();
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new CloudwatchCommandSet_1.CloudwatchCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._connectionResolver.configure(config);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    isOpen() {
        return this._opened;
    }
    open(correlationId, callback) {
        if (this._opened) {
            callback(null);
            return;
        }
        this._opened = true;
        async.series([
            (callback) => {
                this._connectionResolver.resolve(correlationId, (err, connection) => {
                    this._connection = connection;
                    if (callback != null)
                        callback(err);
                });
            },
            (callback) => {
                let aws = require('aws-sdk');
                aws.config.update({
                    accessKeyId: this._connection.getAccessId(),
                    secretAccessKey: this._connection.getAccessKey(),
                    region: this._connection.getRegion()
                });
                this._logsClient = new aws.CloudWatchLogs({ apiVersion: '2014-03-28' });
                this._metricsClient = new aws.CloudWatch({ apiVersion: '2010-08-01' });
                callback();
            }
        ], callback);
    }
    close(correlationId, callback) {
        this._opened = false;
        this._logsClient = null;
        if (callback)
            callback(null);
    }
    getLogGroups(correlationId, logGroupNamePrefix, limit, callback) {
        var params = {
            limit: limit ? limit : 50,
            logGroupNamePrefix: logGroupNamePrefix ? logGroupNamePrefix : null
        };
        this._logsClient.describeLogGroups(params, (err, data) => {
            if (err) {
                // this._logger.error(correlationId, "Error while describeLogGroups: %s; Stack: %s", err, err.stack);
                console.log(err, err.stack);
            }
            if (callback)
                callback(err, data);
        });
    }
    getLogStreams(correlationId, logGroupName, logStreamNamePrefix, limit, callback) {
        var params = {
            logGroupName: logGroupName,
            descending: false,
            limit: limit ? limit : 50,
            logStreamNamePrefix: logStreamNamePrefix ? logStreamNamePrefix : null
        };
        this._logsClient.describeLogStreams(params, (err, data) => {
            if (err) {
                // this._logger.error(correlationId, "Error while describeLogStreams: %s; Stack: %s", err, err.stack);
                console.log(err, err.stack);
            }
            if (callback)
                callback(err, data);
        });
    }
    getLogEvents(correlationId, group, stream, startTime, endTime, filter, limit, callback) {
        var params = {
            logGroupName: group,
            logStreamNames: [stream],
            filterPattern: filter,
            startTime: startTime.getTime(),
            endTime: endTime.getTime(),
            limit: limit ? limit : 10000
        };
        this._logsClient.filterLogEvents(params, function (err, data) {
            if (err) {
                // this._logger.error(correlationId, "Error while filterLogEvents: %s; Stack: %s", err, err.stack);
                console.log(err, err.stack); // an error occurred
            }
            if (callback)
                callback(err, data);
        });
    }
    getMetricData(correlationId, namespace, startTime, endTime, period, type, unit, metric, callback) {
        let metrics;
        async.series([
            (callback) => {
                let listMetricsparams;
                if (metric) {
                    listMetricsparams = {
                        Namespace: namespace,
                        MetricName: metric
                    };
                }
                else {
                    listMetricsparams = {
                        Namespace: namespace
                    };
                }
                this._metricsClient.listMetrics(listMetricsparams, function (err, data) {
                    if (err) {
                        // this._logger.error(correlationId, "Error while listMetrics: %s; Stack: %s", err, err.stack);
                        console.log(err, err.stack); // an error occurred
                    }
                    else {
                        metrics = data.Metrics;
                    }
                    if (callback)
                        callback(err);
                });
            },
            (callback) => {
                if (metrics.length == 0) {
                    // this._logger.trace(correlationId, "Not found metrics data for %s namespace", namespace);
                    console.log("Not found metrics data for %s namespace", namespace);
                    callback(null, "Not found metrics data for " + namespace + " namespace");
                    return;
                }
                // metricDataQueries max size is 100. in case of many metrics created array of arrays
                let metricDataQueriesAll;
                metricDataQueriesAll = [];
                let i = 0;
                metrics.forEach(metric => {
                    let dimensions = [];
                    metric.Dimensions.forEach(dimension => {
                        dimensions.push({
                            Name: dimension.Name,
                            Value: dimension.Value
                        });
                    });
                    // initialize array
                    if (!metricDataQueriesAll[i]) {
                        metricDataQueriesAll[i] = [];
                    }
                    else if (metricDataQueriesAll[i].length == 100) {
                        i++;
                        metricDataQueriesAll[i] = [];
                    }
                    let rndString = pip_services3_commons_node_2.RandomString.nextAlphaChar().toLowerCase() + Math.random().toString(36).slice(5);
                    metricDataQueriesAll[i].push({
                        Id: rndString,
                        Label: metric.MetricName + " " + dimensions[0].Value,
                        MetricStat: {
                            Metric: {
                                Dimensions: dimensions,
                                MetricName: metric.MetricName,
                                Namespace: metric.Namespace
                            },
                            Period: period,
                            Stat: type,
                            Unit: unit
                        },
                        ReturnData: true
                    });
                });
                let result = [];
                async.each(metricDataQueriesAll, (metricDataQueries, callback) => {
                    let getMetricDataParams = {
                        EndTime: endTime,
                        MetricDataQueries: metricDataQueries,
                        StartTime: startTime,
                        // MaxDatapoints: 0,
                        ScanBy: CloudwatchScanBy_1.CloudwatchScanBy.TimestampAscending
                    };
                    this._metricsClient.getMetricData(getMetricDataParams, (err, data) => {
                        result.push(data);
                        callback(err, data);
                    });
                }, (err) => {
                    if (err) {
                        // this._logger.error(correlationId, "Error while getMetricData: %s; Stack: %s", err, err.stack);
                        console.log(err, err.stack); // an error occurred
                    }
                    if (callback)
                        callback(err, result);
                });
            }
        ], callback);
    }
}
exports.CloudwatchController = CloudwatchController;
//# sourceMappingURL=CloudwatchController.js.map