#!/usr/bin/env node

const { Command } = require('commander');

const program = new Command();
const wilo = require('./data/wilo.json');

const {
    createProject,
    listProjects,
    renameProject,
    deleteProject,
    changeProjectStatus,
    listProjectTasks,
    showProjectTree
} = require('./functions/project');



program
  .name('Project Utility CLI')
  .description('Manage Projects within this project')
  .version('1.0.0');

program.command('add')
  .description('Create a new Project')
  .argument('<Name>', 'project name')
  .action((str, options) => {
    createProject(str);
  });

program.command('rename')
  .description('Change a Project name')
  .argument('<Key>', 'project key')
  .argument('<Name>', 'new project name')
  .action((str, str2) => {
    renameProject(str, str2);
  });

program.command('rm')
    .description('Remove a Project')
    .argument('<Key>', 'project key')
    .action((str) => {
        deleteProject(str);
    });

program.command('ls')
  .description('Show all Projects')
  .option('-a, --all', 'Show all projects')
  .action((options) => {
    if (options.all) {
        listProjects(wilo.projects);
        return;
    }
    listProjects(wilo.projects.filter(p => p.status === 'open'));
  });

program.command('close')
    .description('Close a Project')
    .argument('<Key>', 'project key')
    .action((str) => {
        changeProjectStatus(str, 'closed');
    });

program.command('reopen')
    .description('Reopen a Project')
    .argument('<Key>', 'project key')
    .action((str) => {
        changeProjectStatus(str, 'open');
    });
    
program.command('tasks')
    .description('List all tasks for a project')
    .argument('<Key>', 'project key')
    .action((str) => {
        listProjectTasks(str);
    });

program.command('tree')
    .description('Show project tree')
    .option('-i, --id [Key]', 'project key')
    .option('-a, --all', 'Show all projects')
    .action((options) => {
        showProjectTree(options.id, !(options.all));
    });

program.parse();