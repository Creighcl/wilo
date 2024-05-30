# WILO (where i left off)

Manage work through the CLI. Converting my notecard system into something re-usable that keeps me in a terminal and pen ink off my arms!

Intent is to open this in a terminal on my home or work laptop and just type `wilo` and get a glance of my objectives, what's ready to work, and what the very next actionable items are on each.

### Installation
- Clone the repo
- `npm install && npm link && wilo init`
- Create your first project: `proj add "My first project"`


### Structure
- A `project` is a thing that needs to get done with multiple steps
- A `task` is assigned to a project with text of what to do
- A `note` is assigned to a project with text
- Projects and Tasks have statuses
  - A project can be closed or open
  - A task can be closed, open, blocked, or NEXT

### Commands
- Use `wilo` to get a look at what needs doing. This is a shortcut for `proj tree`
- Use `proj help` for a list of project-level commands
- Use `task help` for a list of task-level commands
- Use `note help` for a list of note-level commands

### Usage
Manage your work at the project level. Anything that needs to be completed along the way is a task.

Ensure that you have a "NEXT" task on each project to know what is ready for you to do immediately.

Add notes to keep context in mind while you work the project.

Close the project and move on when its time.

