const fs = require('fs');
const db = require('../data/wilo.json');
const { log } = console;
const chalk = require('chalk');
const idText = chalk.bold.greenBright;
const idText2 = chalk.bold.yellowBright;
const error = chalk.bold.red;
const targetText = (isTarget) => isTarget ? chalk.bold.magenta('>>>>') : '    ';

const centerStringToSetLength = (str, len) => {
    const spaces = len - str.length;
    const left = Math.floor(spaces / 2);
    const right = spaces - left;
    return ' '.repeat(left) + str + ' '.repeat(right);
};

const statusColoring = (status) => {
    const txt = centerStringToSetLength(status, 8);
    switch (status) {
        case 'open':
            return txt;
        case 'closed':
            return chalk.bold.red(txt);
        case 'next':
            return chalk.bold.greenBright(txt);
        default:
            return chalk.bold.bgMagentaBright.white(txt);
    }
};

const createFourCharacterId = () => {
    const chars = 'ACDEFGHJKLMNPQRSTUVWXYZ023456789';
    
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

const createTask = (key, tname, isNext = false) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    project.tasks.push({
        name: tname,
        key: createFourCharacterId(),
        created: new Date().toISOString(),
        status: isNext ? 'next' : 'open',
        projectKey: key.toUpperCase()
    });
    savedb(db);
};

const listTasks = (tasks) => {
    (tasks || []).forEach(({ name, key, status, projectKey, target }) => {
        let msg = `${idText(projectKey)} ${idText2(key)} ${targetText(target)} ${stringToSetLength(name, 50)}\t ${statusColoring(status)} ┃`;

        console.log(msg);
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

const setTaskTarget = (key, target) => {
    const task = db.projects.map(p => p.tasks).flat().find(t => t.key === key.toUpperCase());
    if (!task) {
        log(error('Task not found'));
        return;
    }
    task.target = target;
    savedb(db);
};

const moveTask = (key, newProjectKey) => {
    const task = db.projects.map(p => p.tasks).flat().find(t => t.key === key.toUpperCase());
    if (!task) {
        log(error('Task not found'));
        return;
    }
    const projectOld = db.projects.find(p => p.key === task.projectKey.toUpperCase());
    if (!projectOld) {
        log(error('Project not found'));
        return;
    }

    task.projectKey = newProjectKey.toUpperCase();

    const projectNew = db.projects.find(p => p.key === newProjectKey.toUpperCase());
    projectNew.tasks.push(task);

    const taskIndex = projectOld.tasks.findIndex(t => t.key === key.toUpperCase());
    projectOld.tasks.splice(taskIndex, 1);

    savedb(db);
}


module.exports = {
    createTask,
    listTasks,
    renameTask,
    deleteTask,
    changeTaskStatus,
    setTaskTarget,
    moveTask
};