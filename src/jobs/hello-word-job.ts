import chalk from 'chalk';
import { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';

export class HelloWordJob extends CronJob {
    name: string = 'hello-word';
    schedule: string = '* * * * *';
    task: ScheduledTask;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected setAction(): void {
        console.log(chalk.whiteBright(new Date()), this.id, chalk.blue(this.schedule), 'Hello Word')
    }
}