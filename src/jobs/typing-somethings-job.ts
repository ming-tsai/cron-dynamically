import chalk from 'chalk';
import cron, { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';

export class TypingSomethingsJob extends CronJob {
    name: string = 'typing-somethings';
    schedule: string = '* * * * *';
    task: ScheduledTask;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected getTask(cronExpression: string): ScheduledTask {
        return cron.schedule(cronExpression, () => {
            console.log(chalk.whiteBright(new Date()), this.id, chalk.blue(this.schedule), 'typing somethings');
        }, {
            scheduled: false
        });
    }
}