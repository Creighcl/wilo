const fs = require('fs');
const db = require('../data/wilo.json');
const { log } = console;
const chalk = require('chalk');
const idText = chalk.bold.greenBright;
const idText2 = chalk.bold.blueBright;
const error = chalk.bold.red;

const statusColoring = (status) => {
    switch (status) {
        case 'open':
            return chalk.white(status);
        case 'closed':
            return chalk.bold.red(status);
        case 'next':
            return chalk.bold.black.bgGreenBright(status);
        default:
            return chalk.bold.magenta(status);
    }
};

const createFourCharacterId = () => {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
    
    const taskIds = db.projects.map(p => p.tasks).flat().filter(x => x).map(t => t.key);
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

const stringToSetLength = (str, len) => {
    return str.length > len ? str.substr(0, len -3) + '...' : str + ' '.repeat(len - str.length);
}

const savedb = (db) => fs.writeFile('./bin/data/wilo.json', JSON.stringify(db, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
  });

const createTask = (key, tname) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    project.tasks.push({
        name: tname,
        key: createFourCharacterId(),
        created: new Date().toISOString(),
        status: 'open',
        next: false,
        projectKey: key.toUpperCase()
    });
    savedb(db);
};

const listTasks = (tasks) => {
    (tasks || []).forEach(({ name, key, status, projectKey }) => {
        console.log(
            idText(projectKey),
            idText2(key),
            `\t${stringToSetLength(name, 50)}\t`,
            statusColoring(`${status}`)
        );
      });
};

const renameTask = (key, newName) => {
    const task = db.projects.map(p => p.tasks).flat().find(t => t.key === key.toUpperCase());
    if (!task) {
        log(error('Task not found'));
        return;
    }
    task.name = newName;
    savedb(db);
}

const deleteTask = (key) => {
    // remove project from db
    const project = db.projects.find(p => p.tasks.find(t => t.key === key.toUpperCase()));
    if (!project) {
        log(error('Task not found'));
        return;
    }
    const taskIndex = project.tasks.findIndex(t => t.key === key.toUpperCase());
    project.tasks.splice(taskIndex, 1);
    savedb(db);
};

const changeTaskStatus = (key, newStatus) => {
    const task = db.projects.map(p => p.tasks).flat().find(t => t.key === key.toUpperCase());
    if (!task) {
        log(error('Task not found'));
        return;
    }
    task.status = newStatus;
    savedb(db);
};


module.exports = {
    createTask,
    listTasks,
    renameTask,
    deleteTask,
    changeTaskStatus
};