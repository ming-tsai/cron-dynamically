import chalk from 'chalk';
import { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';

export class TypingSomethingsJob extends CronJob {
    name: string = 'typing-somethings';
    schedule: string = '* * * * *';
    task: ScheduledTask;
    isAsync = true;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected async setAsyncAction(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(
                    console.log(chalk.whiteBright(new Date()), this.id, chalk.blue(this.schedule), 'typing somethings')
                );
            }, 2000);
        });
    }
}