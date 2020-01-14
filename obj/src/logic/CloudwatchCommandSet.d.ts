import { CommandSet } from 'pip-services3-commons-node';
import { ICloudwatchController } from './ICloudwatchController';
export declare class CloudwatchCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ICloudwatchController);
    private makeGetLogGroupsCommand;
    private makeGetLogStreamsCommand;
    private makeGetLogEventsCommand;
    private makeGetMetricsCommand;
}
