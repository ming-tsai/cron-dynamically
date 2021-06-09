import cron, { ScheduledTask, ScheduleOptions } from 'node-cron';
import { JobStatus } from '../models/job-status';
import { v4 as uuidv4 } from 'uuid';

export class CronJob {
    status: JobStatus = JobStatus.NotStarted;
    name: string = 'cron-job';
    schedule: string = '* * * * *';
    task: ScheduledTask | undefined;
    isAsync: boolean = false;
    options: ScheduleOptions = {
        scheduled: false
    }

    protected id: string = '';
    constructor() {
    }

    setSchedule(cronExpression: string): void {
        this.schedule = cronExpression;
        this.task = this.getTask(cronExpression);
    }

    start(): void {
        if (this.task && !this.isStarted()) {
            this.status = JobStatus.Started;
            this.task.start();
        }
    }

    stop(): void {
        if (this.task && this.isStarted()) {
            this.status = JobStatus.Stopped;
            this.task.stop();
        }
    }

    isStarted(): boolean {
        return this.status === JobStatus.Started;
    }

    protected getTask(cronExpression: string): ScheduledTask {
        this.id = uuidv4();
        return this.isAsync ?
            cron.schedule(cronExpression, async () => await this.setAsyncAction(), this.options) :
            cron.schedule(cronExpression, () => this.setAction(), this.options);
    }

    /**
     * Action that will call on the schedule job
     */
    protected setAction(): void {
        throw new Error('Method not implemented.');
    }

    /**
     * Asynchronous action that will call on the schedule job
     */
    protected async setAsyncAction(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}