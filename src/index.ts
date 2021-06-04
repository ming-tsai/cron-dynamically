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
    // Read the configuration file
    const fileContents: string = fs.readFileSync(filePath, 'utf8');

    // Convert to a Object
    const data = yaml.load(fileContents) as Array<JobConfiguration>;

    // Read all configured jobs
    data.forEach((d) => {

        // Find the task index
        const index = tasks.findIndex((t) => t.name === d.name);

        // If exists the task on taks list
        if (index !== -1) {

            // Check if the task is enabled and the schedule is different
            if (d.isEnabled && d.schedule !== tasks[index].schedule) {
                tasks[index].stop();
                tasks[index].setSchedule(d.schedule);
            }

            // If is enabled but is not started should start it
            if (d.isEnabled && !tasks[index].isStarted()) {
                console.log(chalk.green(`The task ${tasks[index].name} has started`));
                tasks[index].start();
            }

            // If is not enabled but is started should stop it
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
