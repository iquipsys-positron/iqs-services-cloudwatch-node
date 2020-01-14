export interface ICloudwatchController {
    getLogGroups(correlationId: string, logGroupNamePrefix?: string, limit?: number, callback?: (err: any, result: string) => void): void;
    getLogStreams(correlationId: string, logGroupName: string, logStreamNamePrefix?: string, limit?: number, callback?: (err: any, result: string) => void): void;
    getLogEvents(correlationId: string, group: string, stream: string, startTime: Date, endTime: Date, filter: string, limit?: number, callback?: (err: any, result: string) => void): void;
    getMetricData(correlationId: string, namespace: string, startTime: Date, endTime: Date, period: number, type: string, unit: string, metric?: string, callback?: (err: any, result: string) => void): void;
}
