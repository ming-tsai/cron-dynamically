import { JOB_TASKS as tasks } from './jobs/index';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JobConfiguration } from './models/job-configuration';
import chalk from 'chalk';

let watcher: fs.FSWatcher;
function main() {
    const filePath = path.resolve(__dirname, './configurations/job-configuration.yaml');
    startJobs(filePath);
    watcher = fs.watch(filePath, (event, __) => {
        console.log(chalk.gray('File has been modified'));
        try {
            if (event === 'change') {
                startJobs(filePath);
            } else {
                closeWatcher();
            }
        } catch (error) {
            console.log(chalk.red(error));
        }
    });
}

const startJobs = (filePath: string): void => {
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
}

const closeWatcher = (): void => {
    watcher.close();
}

main();
