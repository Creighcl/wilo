#!/usr/bin/env node

const { Command } = require('commander');

const program = new Command();

const {
    createNote,
    listNotes,
    editNote,
    deleteNote
} = require('./functions/note');

program
  .name('Task Utility CLI')
  .description('Manage Notes in projects')
  .version('1.0.0');

program.command('add')
    .description('Create a new Note')
    .argument('<Key>', 'project key')
    .argument('<Name>', 'note text')
    .action((key, txt) => {
        createNote(key, txt);
    });

program.command('ls')
    .description('Show Notes')
    .argument('<Key>', 'project key')
    .action((key) => {
        listNotes(key);
    });

program.command('edit')
    .description('Rewrite a Note')
    .argument('<Key>', 'note key')
    .argument('<Text>', 'new text')
    .action((key, text) => {
        editNote(key, text);
    });

program.command('rm')
    .description('Remove a Note')
    .argument('<Key>', 'note key')
    .action((str) => {
        deleteNote(str);
    });

program.parse();