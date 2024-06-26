#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .name('WILO Utility CLI')
  .description('WILO - Where I Left Off')
  .version('1.0.0');


program.command('ls', { isDefault: true })
    .description('Where I Left Off')
    .option('-a, --all', 'Show all statuses')
    .action((options) => {
        const { showProjectTree } = require('./functions/project');
        showProjectTree(null, true, options.all);
    });

program.command('init')
    .description('Initialize the utility')
    .action(() => {
        const starter = { "projects": [] };
        if (!fs.existsSync('./bin/data/wilo.json')) {
            fs.writeFile('./bin/data/wilo.json', JSON.stringify(starter, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
            });
        }
    });

program.command('t')
    .description('WILO Targets')
    .action(() => {
        const { showTargetTree } = require('./functions/project');
        showTargetTree();
    })

program.parse();
