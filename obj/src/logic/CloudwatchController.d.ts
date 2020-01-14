import { ConfigParams, IOpenable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { ICloudwatchController } from './ICloudwatchController';
export declare class CloudwatchController implements ICloudwatchController, ICommandable, IConfigurable, IReferenceable, IOpenable {
    private _logger;
    private _dependencyResolver;
    private _commandSet;
    private _opened;
    private _connectionResolver;
    private _connection;
    private _logsClient;
    private _metricsClient;
    constructor();
    getCommandSet(): CommandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    isOpen(): boolean;
    open(correlationId: string, callback: (err: any) => void): void;
    close(correlationId: string, callback: (err: any) => void): void;
    getLogGroups(correlationId: string, logGroupNamePrefix?: string, limit?: number, callback?: (err: any, result: string) => void): void;
    getLogStreams(correlationId: string, logGroupName: string, logStreamNamePrefix?: string, limit?: number, callback?: (err: any, result: string) => void): void;
    getLogEvents(correlationId: string, group: string, stream: string, startTime: Date, endTime: Date, filter: string, limit?: number, callback?: (err: any, results: string) => void): void;
    getMetricData(correlationId: string, namespace: string, startTime: Date, endTime: Date, period: number, type: string, unit: string, metric: string, callback?: (err: any, result: string) => void): void;
}
