const fs = require('fs');
const db = require('../data/wilo.json');
const { format } = require('date-fns');
const { log } = console;
const chalk = require('chalk');
const idText = chalk.bold.greenBright;
const idText2 = chalk.bold.cyanBright;
const dateText = chalk.cyanBright;
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

const forceStringToLength = (str, len) => {
    return str.length < len ? str + ' '.repeat(len - str.length) : str.substr(0, len);
};

const breakStringInMultipleLines = (str, len) => {
    const words = str.split(' ');
    const lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
        if ((line + words[i]).length > len) {
            lines.push(line);
            line = '';
        }
        line += words[i] + ' ';
    }
    lines.push(forceStringToLength(line, 52));
    return lines;
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
        const line1Start = `${idText(projectId)} ${idText2(key)}      `;
        const line1End = '      ' + dateText(format(created, 'MMMdd`yy') + chalk.white(' ┃'));
        const lines = breakStringInMultipleLines(message, 52);
        console.log(line1Start + lines[0] + line1End);
        for (let i = 1; i < lines.length; i++) {
            console.log(' '.repeat(15) + lines[i] + '               ┃');
        }
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

const redateNote = (key, newDate) => {
    const note = db.projects.map(p => p.notes).flat().find(t => t.key === key.toUpperCase());
    if (!note) {
        log(error('Note not found'));
        return;
    }
    note.created = newDate;
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
    deleteNote,
    redateNote
};