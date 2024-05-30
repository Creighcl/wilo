const fs = require('fs');
const db = require('../data/wilo.json');
const { log } = console;
const chalk = require('chalk');
const { listTasks } = require('./task');
const { listNotes } = require('./note');
const idText = chalk.bold.greenBright;
const error = chalk.bold.red;

const statusColoring = (status) => {
    switch (status) {
        case 'open':
            return chalk.white(status);
        case 'closed':
            return chalk.bold.red(status);
        case 'next':
            return chalk.bold.greenBright(status);
        default:
            return chalk.bold.magenta(status);
    }
};


const createFourCharacterId = () => {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
    const exists = true;
    
    while (exists) {
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (!db.projects.find(p => p.key === result)) {
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

const createProject = (pname) => {
    const newKey = createFourCharacterId();;
    db.projects.push({
        name: pname,
        key: newKey,
        created: new Date().toISOString(),
        status: 'open',
        tasks: [],
        notes: []
    });
    savedb(db);
    log(error(`New Project: ${pname} (${newKey})`));
};

const listProjects = (projects) => {
    projects.forEach(({ name, key, status }) => {
        console.log(idText(key), `\t${stringToSetLength(name, 50)} \t `, statusColoring(status));
      });
};

const renameProject = (key, newName) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    project.name = newName;
    savedb(db);
}

const deleteProject = (key) => {
    const projectIndex = db.projects.findIndex(p => p.key === key.toUpperCase());
    if (projectIndex === -1) {
        log(error('Project not found'));
        return;
    }
    db.projects.splice(projectIndex, 1);

    savedb(db);
};

const changeProjectStatus = (key, newStatus) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    project.status = newStatus;
    savedb(db);
};

const listProjectTasks = (key) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }
    const tasks = project.tasks;
    listTasks(tasks);
};

const showProjectTree = (key, hideClosed) => {
    let projects = db.projects;

    if (key) {
        const project = db.projects.find(p => p.key === key.toUpperCase());
        if (!project) {
            log(error('Project not found'));
            return;
        }
        projects = [project];
    }

    if (hideClosed && !key) {
        projects = projects.filter(p => p.status !== 'closed');
    }

    projects.forEach(project => {
        listProjects([project]);
        const tasks = project.tasks;
        listTasks(tasks);
        listNotes(project.key);
        console.log('');
    });
}

module.exports = {
    createProject,
    listProjects,
    renameProject,
    deleteProject,
    changeProjectStatus,
    listProjectTasks,
    showProjectTree
};