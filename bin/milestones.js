#!/usr/bin/env node

const { Command } = require('commander');

const program = new Command();

const {
    createMilestone,
    listMilestones,
    renameMilestone,
    redateMilestone,
    deleteMilestone
} = require('./functions/milestone');

program
  .name('Milestone Utility CLI')
  .description('Manage Milestones in projects')
  .version('1.0.0');

program.command('add')
    .description('Create a new Milestone')
    .argument('<Key>', 'project key')
    .argument('<Date>', 'milestone date')
    .argument('<Text>', 'milestone text')
    .action((key, date, text) => {
        createMilestone(key, date, text);
    });

program.command('ls')
    .description('Show Milestones')
    .argument('<Key>', 'project key')
    .action((key) => {
        listMilestones(key);
    });

program.command('rename')
    .description('Rename a Milestone')
    .argument('<Key>', 'milestone key')
    .argument('<Text>', 'milestone text')
    .action((key, text) => {
        renameMilestone(key, text);
    });

program.command('redate')
    .description('Redate a Milestone')
    .argument('<Key>', 'milestone key')
    .argument('<Date>', 'new date')
    .action((key, date) => {
        redateMilestone(key, date);
    });

program.command('rm')
    .description('Remove a Milestone')
    .argument('<Key>', 'milestone key')
    .action((str) => {
        deleteMilestone(str);
    });

program.parse();