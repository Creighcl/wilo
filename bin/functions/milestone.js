const fs = require('fs');
const db = require('../data/wilo.json');
const { format } = require('date-fns');
const { log } = console;
const chalk = require('chalk');
const idText = chalk.bold.greenBright;
const idText2 = chalk.bold.redBright;
const dateText = chalk.redBright;
const error = chalk.bold.red;

const lateText = (date) => {
    const now = new Date();
    const due = new Date(date);
    const late = now > due;
    return late ? chalk.bold.red('!!!!') : '    ';
};


const createFourCharacterId = () => {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
    
    const milestoneIds = db.projects.map(p => (p.milestones || [])).flat().filter(x => x).map(t => t.key);
    while (true) {
        let result = '';
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (!milestoneIds.find(t => t.key === result)) {
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
            lines.push(forceStringToLength(line, 52));
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

const createMilestone = (key, text, date) => {
    const project = db.projects.find(p => p.key === key.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }

    if (!project.milestones) {
        project.milestones = [];
    }

    project.milestones.push({
        date,
        text,
        key: createFourCharacterId(),
        created: new Date().toISOString(),
        projectKey: project.key.toUpperCase()
    });
    savedb(db);
};

const listMilestones = (projectId) => {
    const project = db.projects.find(p => p.key === projectId.toUpperCase());
    if (!project) {
        log(error('Project not found'));
        return;
    }

    const milestones = project.milestones || [];
    milestones.forEach(({ key, date, text }) => {
        const line1Start = `${idText(projectId)} ${idText2(key)} ${lateText(date)} `;
        const line1End = `      ${dateText(format(new Date(date), 'MMMdd\`yy'))} ┃`;
        const lines = breakStringInMultipleLines(text, 52);
        console.log(line1Start + lines[0] + line1End);
        for (let i = 1; i < lines.length; i++) {
            console.log(' '.repeat(15) + lines[i] + '               ┃');
        }
    });
};

const renameMilestone = (key, newName) => {
    const milestone = db.projects.map(p => p.milestones).flat().find(t => t.key === key.toUpperCase());
    if (!milestone) {
        log(error('Milestone not found'));
        return;
    }
    milestone.text = newName;
    savedb(db);
};

const redateMilestone = (key, newDate) => {
    const milestone = db.projects.map(p => (p.milestones ||[])).flat().find(t => t.key === key.toUpperCase());
    if (!milestone) {
        log(error('Milestone not found'));
        return;
    }
    milestone.date = newDate;
    savedb(db);
};

const deleteMilestone = (key) => {
    const project = db.projects.find(p => (p.milestones || []).find(t => t.key === key.toUpperCase()));
    if (!project) {
        log(error('Milestone not found'));
        return;
    }
    const milestoneIndex = project.milestones.findIndex(t => t.key === key.toUpperCase());
    project.milestones.splice(milestoneIndex, 1);
    savedb(db);
};


module.exports = {
    createMilestone,
    listMilestones,
    renameMilestone,
    redateMilestone,
    deleteMilestone
};