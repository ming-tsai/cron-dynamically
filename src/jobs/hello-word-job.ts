import chalk from 'chalk';
import cron, { ScheduledTask } from 'node-cron';
import { CronJob } from './cron-job';
import { v4 as uuidv4 } from 'uuid';

export class HelloWordJob extends CronJob {
    name: string = 'hello-word';
    schedule: string = '* * * * *';
    task: ScheduledTask;

    constructor() {
        super();
        this.task = this.getTask(this.schedule);
    }

    protected getTask(cronExpression: string): ScheduledTask {
        this.id = uuidv4();
        return cron.schedule(cronExpression, () => this.setAction(), this.options);
    }

    protected setAction(): void {
        console.log(chalk.whiteBright(new Date()), this.id, chalk.blue(this.schedule), 'Hello Word')
    }
}