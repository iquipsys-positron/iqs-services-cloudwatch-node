let _ = require('lodash');
let async = require('async');

import { ConfigParams, IOpenable, IdGenerator } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';

import { ICloudwatchController } from './ICloudwatchController';
import { CloudwatchCommandSet } from './CloudwatchCommandSet';
import { AwsConnectionResolver } from 'pip-services3-aws-node';
import { AwsConnectionParams } from 'pip-services3-aws-node';
import { CloudwatchUnit } from '../data/CloudwatchUnit';
import { CloudwatchScanBy } from '../data/CloudwatchScanBy';
import { RandomString } from 'pip-services3-commons-node';

export class CloudwatchController
    implements ICloudwatchController, ICommandable, IConfigurable, IReferenceable, IOpenable {

    private _logger: CompositeLogger = new CompositeLogger();

    private _dependencyResolver: DependencyResolver;
    private _commandSet: CloudwatchCommandSet;
    private _opened: boolean = false;

    private _connectionResolver: AwsConnectionResolver = new AwsConnectionResolver();
    private _connection: AwsConnectionParams;
    private _logsClient: any = null; //AmazonCloudWatchClient Logs
    private _metricsClient: any = null; //AmazonCloudWatchClient Metrics

    constructor() {
        this._dependencyResolver = new DependencyResolver();
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CloudwatchCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._connectionResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._connectionResolver.setReferences(references);
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
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

    public close(correlationId: string, callback: (err: any) => void): void {
        this._opened = false;
        this._logsClient = null;

        if (callback) callback(null);
    }

    public getLogGroups(correlationId: string, logGroupNamePrefix?: string, limit?: number,
        callback?: (err: any, result: string) => void) {
        var params = {
            limit: limit ? limit : 50, // 50 is default
            logGroupNamePrefix: logGroupNamePrefix ? logGroupNamePrefix : null
        };

        this._logsClient.describeLogGroups(params, (err, data) => {
            if (err) {
                // this._logger.error(correlationId, "Error while describeLogGroups: %s; Stack: %s", err, err.stack);
                console.log(err, err.stack);
            }

            if (callback) callback(err, data);
        })
    }

    public getLogStreams(correlationId: string, logGroupName: string, logStreamNamePrefix?: string, limit?: number,
        callback?: (err: any, result: string) => void) {
        var params = {
            logGroupName: logGroupName,
            descending: false,
            limit: limit ? limit : 50, // 50 is default
            logStreamNamePrefix: logStreamNamePrefix ? logStreamNamePrefix : null
        };

        this._logsClient.describeLogStreams(params, (err, data) => {
            if (err) {
                // this._logger.error(correlationId, "Error while describeLogStreams: %s; Stack: %s", err, err.stack);
                console.log(err, err.stack);
            }

            if (callback) callback(err, data);
        });
    }

    public getLogEvents(correlationId: string, group: string, stream: string, startTime: Date, endTime: Date,
        filter: string, limit?: number, callback?: (err: any, results: string) => void): void {
        var params = {
            logGroupName: group, /* required */
            logStreamNames: [stream], /* required */
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

            if (callback) callback(err, data);
        });
    }

    public getMetricData(correlationId: string, namespace: string, startTime: Date, endTime: Date,
        period: number, type: string, unit: string, metric: string, callback?: (err: any, result: string) => void): void {

        let metrics: any;

        async.series([
            (callback) => {
                let listMetricsparams: any;
                if (metric) {
                    listMetricsparams = {
                        Namespace: namespace,
                        MetricName: metric
                    };
                } else {
                    listMetricsparams = {
                        Namespace: namespace
                    };
                }

                this._metricsClient.listMetrics(listMetricsparams, function (err, data) {
                    if (err) {
                        // this._logger.error(correlationId, "Error while listMetrics: %s; Stack: %s", err, err.stack);
                        console.log(err, err.stack); // an error occurred
                    } else {
                        metrics = data.Metrics;
                    }

                    if (callback) callback(err);
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
                let metricDataQueriesAll: any[][];
                metricDataQueriesAll = [];
                let i = 0;

                metrics.forEach(metric => {
                    let dimensions = [];
                    metric.Dimensions.forEach(dimension => {
                        dimensions.push({
                            Name: dimension.Name,
                            Value: dimension.Value
                        })
                    });

                    // initialize array
                    if (!metricDataQueriesAll[i]) {
                        metricDataQueriesAll[i] = [];
                    } else if (metricDataQueriesAll[i].length == 100) {
                        i++;
                        metricDataQueriesAll[i] = [];
                    }

                    let rndString = RandomString.nextAlphaChar().toLowerCase() + Math.random().toString(36).slice(5);
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
                        ScanBy: CloudwatchScanBy.TimestampAscending
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
                    if (callback) callback(err, result);

                });

            }
        ], callback);
    }
}