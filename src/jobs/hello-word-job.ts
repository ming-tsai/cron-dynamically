import chalk from 'chalk';
import cron, { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';

export class HelloWordJob extends CronJob {
    status: string = 'NotStarted';
    name: string = 'hello-word';
    schedule: string = '* * * * *';
    task: ScheduledTask;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected getTask(cronExpression: string): ScheduledTask {
        return cron.schedule(cronExpression, () => {
            console.log(chalk.whiteBright(new Date()), this.id, chalk.blue(this.schedule), 'Hello Word')
        }, {
            scheduled: false
        });
    }
}