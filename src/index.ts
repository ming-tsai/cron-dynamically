import { JOB_TASKS as tasks } from './jobs/index';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JobConfiguration } from './models/job-configuration';
import chalk from 'chalk';

export default cron.schedule('* * * * *', () => {
    try {
        const filePath = path.resolve(__dirname, './configurations/job-configuration.yaml');
        const fileContents: string = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContents) as Array<JobConfiguration>;
        data.forEach((d) => {
            const index = tasks.findIndex((t) => t.name === d.name);
            if (index !== -1) {
                if (d.isEnabled && d.schedule !== tasks[index].schedule) {
                    tasks[index].stop();
                    tasks[index].setSchedule(d.schedule);
                }
                
                if (d.isEnabled && !tasks[index].isStarted()) {
                    console.log(chalk.green(`The task ${tasks[index].name} has started`));
                    tasks[index].start();
                }

                if (!d.isEnabled && tasks[index].isStarted()) {
                    console.log(chalk.green(`The task ${tasks[index].name} has stopped`));
                    tasks[index].stop();
                }
            }
        });
    } catch (error) {
        console.log(chalk.red(error));
    }
});
