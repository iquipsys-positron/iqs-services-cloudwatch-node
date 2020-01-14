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


import { CloudwatchController } from '../../../src/logic/CloudwatchController';
import { CloudwatchHttpServiceV1 } from '../../../src/services/version1/CloudwatchHttpServiceV1';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('CloudwatchHttpServiceV1', () => {
    let service: CloudwatchHttpServiceV1;

    let rest: any;

    let AWS_REGION = process.env["AWS_REGION"] || "";
    let AWS_ACCESS_ID = process.env["AWS_ACCESS_ID"] || "";
    let AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"] || "";

    if (!AWS_REGION || !AWS_ACCESS_ID || !AWS_ACCESS_KEY)
        return;

    suiteSetup((done) => {
        let controller = new CloudwatchController();
        controller.configure(ConfigParams.fromTuples(
            "connection.region", AWS_REGION,
            "credential.access_id", AWS_ACCESS_ID,
            "credential.access_key", AWS_ACCESS_KEY
        ));
        // controller.configure(new ConfigParams());

        service = new CloudwatchHttpServiceV1();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-cloudwatch', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-cloudwatch', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        controller.open(null, null);

        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('Get log groups', (done) => {
        rest.post('/v1/cloudwatch/get_log_groups',
            {
                name_prefix: "iqs",
                limit: 1
            },
            (err, req, res, page) => {
                assert.isNull(err);
                done(err);
            });
    });

    test('Get log streams', (done) => {
        rest.post('/v1/cloudwatch/get_log_streams',
            {
                group: "iqs-services-components-node",
                stream_prefix: "iqs",
                limit: 1
            },
            (err, req, res, page) => {
                assert.isNull(err);
                done(err);
            });
    });

    test('Get logs', (done) => {
        rest.post('/v1/cloudwatch/get_logs',
            {
                group: "iqs-services-components-node",
                stream: "iqs-services-components",
                start_time: "2018-10-04T00:34:55.190Z",
                end_time: "2018-10-04T02:34:55.190Z",
                filter: "ERROR",
                limit: 5
            },
            (err, req, res, page) => {
                assert.isNull(err);
                done(err);
            }
        );
    });

    test('Get metrics', (done) => {
        rest.post('/v1/cloudwatch/get_metrics',
            {
                namespace: "iqs-services-components",
                start_time: "2018-10-04T00:34:55.190Z",
                end_time: "2018-10-04T14:34:55.190Z",
                period: 300,
                unit: "Milliseconds",
                type: "Average"
            },
            (err, req, res, page) => {
                assert.isNull(err);
                done(err);
            }
        );
    });

});