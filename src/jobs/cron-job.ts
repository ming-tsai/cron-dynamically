import { ScheduledTask } from 'node-cron';
import { getuid } from 'process';
import {v4 as uuidv4} from 'uuid';

export class CronJob {
    status: string = 'NotStarted';
    name: string = 'cron-job';
    schedule: string = '* * * * *';
    task: ScheduledTask | undefined;
    protected id: string;

    constructor() {
        this.id = uuidv4();
    }

    setSchedule(cronExpression: string): void {
        this.schedule = cronExpression;
        this.task = this.getTask(cronExpression);
    }

    start(): void {
        if (this.task && !this.isStarted()) {
            this.status = 'Started';
            this.task.start();
        }
    }

    stop(): void {
        if (this.task && this.isStarted()) {
            this.status = 'Stopped';
            this.task.stop();
        }
    }

    isStarted(): boolean {
        return this.status === 'Started';
    }

    protected getTask(cronExpression: string): ScheduledTask {
        throw new Error('Method not implemented.');
    }
}