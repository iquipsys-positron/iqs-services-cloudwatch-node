let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { LogLevel } from 'pip-services3-components-node';
import { ErrorDescriptionFactory } from 'pip-services3-commons-node';


import { CloudwatchController } from '../../src/logic/CloudwatchController';
import { CloudWatchUnit } from 'pip-services3-aws-node';

suite('CloudwatchController', () => {
    let controller = new CloudwatchController();

    let AWS_REGION = process.env["AWS_REGION"] || "";
    let AWS_ACCESS_ID = process.env["AWS_ACCESS_ID"] || "";
    let AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"] || "";

    if (!AWS_REGION || !AWS_ACCESS_ID || !AWS_ACCESS_KEY)
        return;

    suiteSetup((done) => {

        controller.configure(ConfigParams.fromTuples(
            "connection.region", AWS_REGION,
            "credential.access_id", AWS_ACCESS_ID,
            "credential.access_key", AWS_ACCESS_KEY
        ));

        controller.open(null, done);
    });

    suiteTeardown((done) => {
        controller.close(null, done);
    });

    test('Get log groups', (done) => {
        let namePrefix = "iqs";
        let limit = 1;

        controller.getLogGroups(null, namePrefix, limit, (err, result) => {
            assert.isNull(err);
            done();
        });
    });

    test('Get log streams', (done) => {
        let group = "iqs-services-components-node";
        let namePrefix = "iqs";
        let limit = 1;

        controller.getLogStreams(null, group, namePrefix, limit, (err, result) => {
            assert.isNull(err);
            done();
        });
    });

    test('Get logs', (done) => {
        let group = "iqs-services-components-node";
        let stream = "iqs-services-components";
        let startTime = new Date("2018-10-04T00:34:55.190Z");
        let endTime = new Date("2018-10-04T02:34:55.190Z");
        let filter = "ERROR";
        let limit = 5;

        controller.getLogEvents(null, group, stream, startTime, endTime, filter, limit, (err) => {
            assert.isNull(err);
            done();
        });
    });

    test('Get metrics', (done) => {
        let namespace = "iqs-services-components";
        let startTime = new Date("2018-10-04T00:34:55.190Z");
        let endTime = new Date("2018-10-04T14:34:55.190Z");
        let period = 300;
        let unit = CloudWatchUnit.Milliseconds;
        let type = "Average"

        controller.getMetricData(null, namespace, startTime, endTime, period, type, unit, null, (err) => {
            assert.isNull(err);
            done();
        });
    });
});