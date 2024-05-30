const fs = require('fs');
const db = require('../data/wilo.json');
const { format } = require('date-fns');
const { log } = console;
const chalk = require('chalk');
const idText = chalk.bold.greenBright;
const idText2 = chalk.bold.magentaBright;
const dateText = chalk.gray;
const error = chalk.bold.red;

const createFourCharacterId = () => {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
    
    const taskIds = db.projects.map(p => p.notes).flat().filter(x => x).map(t => t.key);
    while (true) {
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (!taskIds.find(t => t.key === result)) {
            return result;
        }
    }
};

const savedb = (db) => fs.writeFile('./bin/data/wilo.json', JSON.stringify(db, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
  });

const createNote = (key, txt) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    project.notes.push({
        message: txt,
        key: createFourCharacterId(),
        created: new Date().toISOString(),
        projectKey: project.key.toUpperCase()
    });
    savedb(db);
};

const listNotes = (projectId) => {
    const project = db.projects.find(p => p.key === projectId.toUpperCase());
    (project.notes || []).forEach(({ message, key, created }) => {
        console.log(
            idText(projectId),
            idText2(key),
            dateText(format(created, 'MMMdd`yy')),
            idText2('>>> ') + message
        );
      });
};

const editNote = (key, newText) => {
    const note = db.projects.map(p => p.notes).flat().find(t => t.key === key.toUpperCase());
    if (!note) {
        log(error('Note not found'));
        return;
    }
    note.message = newText;
    savedb(db);
}

const deleteNote = (key) => {
    const project = db.projects.find(p => p.notes.find(t => t.key === key.toUpperCase()));
    if (!project) {
        log(error('Note not found'));
        return;
    }
    const noteIndex = project.notes.findIndex(t => t.key === key.toUpperCase());
    project.notes.splice(noteIndex, 1);
    savedb(db);
};

module.exports = {
    createNote,
    listNotes,
    editNote,
    deleteNote
};