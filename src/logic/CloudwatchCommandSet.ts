let _ = require('lodash');

import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { ICloudwatchController } from './ICloudwatchController';

export class CloudwatchCommandSet extends CommandSet {
	private _logic: ICloudwatchController;

	constructor(logic: ICloudwatchController) {
		super();

		this._logic = logic;

		this.addCommand(this.makeGetLogGroupsCommand());
		this.addCommand(this.makeGetLogStreamsCommand());
		this.addCommand(this.makeGetLogEventsCommand());
		this.addCommand(this.makeGetMetricsCommand());
	}

	private makeGetLogGroupsCommand(): ICommand {
		return new Command(
			"get_log_groups",
			new ObjectSchema(true)
				.withOptionalProperty("name_prefix", TypeCode.String)
				.withOptionalProperty("limit", TypeCode.Integer),
			(correlationId: string, args: Parameters, callback: (err: any, result: string) => void) => {
				let namePrefix = args.get("name_prefix");
				let limit = args.get("limit");
				this._logic.getLogGroups(correlationId, namePrefix, limit, callback);
			}
		);
	}

	private makeGetLogStreamsCommand(): ICommand {
		return new Command(
			"get_log_streams",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withOptionalProperty("stream_prefix", TypeCode.String)
				.withOptionalProperty("limit", TypeCode.Integer),
			(correlationId: string, args: Parameters, callback: (err: any, result: string) => void) => {
				let group = args.get("group");
				let streamPrefix = args.get("stream_prefix");
				let limit = args.get("limit");
				this._logic.getLogStreams(correlationId, group, streamPrefix, limit, callback);
			}
		);
	}

	private makeGetLogEventsCommand(): ICommand {
		return new Command(
			"get_logs",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("stream", TypeCode.String)
				.withRequiredProperty("start_time", TypeCode.String)
				.withRequiredProperty("end_time", TypeCode.String)
				.withRequiredProperty("filter", TypeCode.String)
				.withOptionalProperty("limit", TypeCode.Integer),
			(correlationId: string, args: Parameters, callback: (err: any, result: string) => void) => {
				let group = args.get("group");
				let stream = args.get("stream");
				let startTime = new Date(args.get("start_time"));
				let endTime = new Date(args.get("end_time"));
				let filter = args.get("filter");
				let limit = args.get("limit");
				this._logic.getLogEvents(correlationId, group, stream, startTime, endTime, filter, limit, callback);
			}
		);
	}

	private makeGetMetricsCommand(): ICommand {
		return new Command(
			"get_metrics",
			new ObjectSchema(true)
				.withRequiredProperty("namespace", TypeCode.String)
				.withRequiredProperty("start_time", TypeCode.String)
				.withRequiredProperty("end_time", TypeCode.String)
				.withRequiredProperty("period", TypeCode.Integer)
				.withRequiredProperty("unit", TypeCode.String)
				.withRequiredProperty("type", TypeCode.String)
				.withOptionalProperty("metric", TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: string) => void) => {
				let namespace = args.get("namespace");
				let startTime = new Date(args.get("start_time"));
				let endTime = new Date(args.get("end_time"));
				let period = args.get("period");
				let unit = args.get("unit");
				let type = args.get("type");
				let metric = args.get("metric");
				this._logic.getMetricData(correlationId, namespace, startTime, endTime, period, type,
					unit, metric, callback);
			}
		);
	}
}