import chalk from 'chalk';
import cron, { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';
import { v4 as uuidv4 } from 'uuid';

export class TypingSomethingsJob extends CronJob {
    name: string = 'typing-somethings';
    schedule: string = '* * * * *';
    task: ScheduledTask;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected getTask(cronExpression: string): ScheduledTask {
        this.id = uuidv4();
        return cron.schedule(cronExpression, async () => await this.setAsyncAction(), this.options);
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