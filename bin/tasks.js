#!/usr/bin/env node

const { Command } = require('commander');

const program = new Command();
const wilo = require('./data/wilo.json');

const {
    createTask,
    listTasks,
    renameTask,
    deleteTask,
    changeTaskStatus,
    setTaskTarget,
    moveTask
} = require('./functions/task');


program
  .name('Task Utility CLI')
  .description('Manage Tasks in projects')
  .version('1.0.0');

program.command('add')
    .description('Create a new Task')
    .argument('<Key>', 'project key')
    .argument('<Name>', 'task name')
    .action((key, name) => {
        createTask(key, name);
    });

program.command('ls')
    .description('Show Open Tasks (--all/-a to show all tasks)')
    .option('-a, --all', 'Show all tasks')
    .action((options) => {
        if (options.all) {
            listTasks(wilo.projects.map(p => p.tasks).flat().filter(x => x));
        } else {
            listTasks(wilo.projects.map(p => p.tasks).flat().filter(x => x && x.status !== 'closed'));
        }
    });

program.command('rename')
    .description('Change a Task name')
    .argument('<Key>', 'task key')
    .argument('<Name>', 'new task name')
    .action((key, name) => {
        renameTask(key, name);
    });

program.command('rm')
    .description('Remove a Task')
    .argument('<Key>', 'task key')
    .action((str) => {
        deleteTask(str);
    });

program.command('close')
    .description('Close a Task')
    .argument('<Key>', 'task key')
    .action((str) => {
        changeTaskStatus(str, 'closed');
    });

program.command('open')
    .description('Reopen a Task')
    .argument('<Key>', 'task key')
    .action((str) => {
        changeTaskStatus(str, 'open');
    });

program.command('next')
    .description('Mark a Task as next')
    .argument('<Key>', 'task key')
    .action((str) => {
        changeTaskStatus(str, 'next');
    });

program.command('block')
    .description('Block a Task')
    .argument('<Key>', 'task key')
    .argument('<BlockerKey>', 'blocker task key')
    .action((key, blockerKey) => {
        changeTaskStatus(key, `blocked(${blockerKey})`);
    });

program.command('target')
    .description('Add this task to target list')
    .argument('<Key>', 'task key')
    .action((str) => {
        setTaskTarget(str, true);
    });

program.command('untarget')
    .description('Remove this task from target list')
    .argument('<Key>', 'task key')
    .action((str) => {
        setTaskTarget(str, false);
    });

program.command('mv')
    .description('Move a Task to a different project')
    .argument('<Key>', 'task key')
    .argument('<ProjectKey>', 'project key')
    .action((key, projectKey) => {
        moveTask(key, projectKey);
    });

program.parse();