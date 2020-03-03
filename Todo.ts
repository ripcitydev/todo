import { Asana } from './Asana';
import {Github} from './Github';
import { Jira } from './Jira';

import { Task } from './Task';

const fs = require('fs');

const read = require('readline');
const write = require('stream').Writable;

export class Todo {
    public static config = Todo.configure();

    public static output = new write({
        write: function(chunk, encoding, callback) {
            if (!this.muted)
                process.stdout.write(chunk, encoding);
    
            callback();
        }
    });
    
    private static input = read.createInterface({
        input: process.stdin,
        output: Todo.output,
        terminal: true
    });
    
    public static async question(text: string) {
        return new Promise((resolve) => {
            Todo.input.question(`${text}: `, (answer) => {
                //console.log(`${answer}`);

                resolve(answer.toString());
            });
        });
    }
    
    private static configure() {
        let config;

        config = Todo.init();
        
        let excludes = {};
        for (let e=0; e<config.excludes.length; e++) {
            let exclude = config.excludes[e].toString().replace('../').replace('./').replace('~/').replace('/');
            
            excludes[`./${exclude!='undefined'?exclude:''}`.replace(/\/\.?$/, '')] = true;
        }
        config.excludes = excludes;

        let extensions = {};
        for (let e=0; e<config.extensions.length; e++) {
            let extension = config.extensions[e].toString().toLowerCase().split('.');

            extensions[extension[extension.length-1]] = true;
        }
        config.extensions = extensions;
        
        return config;
    }

    public static init(cwd = false) {
        let todo;
    
        try {
            todo = JSON.parse(fs.readFileSync(`${cwd?process.env.INIT_CWD:'.'}/todo.json`));
        }
        catch (error) {
            todo = {
                keywords: ['todo', 'fixme'],
                includes: ['.'],
                excludes: ['.git', 'node_modules', 'package.json'],
                extensions: ['ts'],
                jira: {
                    hostname: '',
                    username: '',
                    project: ''
                }
            };
            
            fs.writeFileSync(`${cwd?process.env.INIT_CWD:'.'}/todo.json`, JSON.stringify(todo, null, '  '));

            fs.closeSync();
        }

        if (cwd) Todo.input.close();

        return todo;
    }
    
    public static async parse() {
        let task;
        
        console.log('To change the defaults ^C, and edit todo.json.');
        
        task = await Todo.question('(J)ira, (G)ithub, or (A)sana');
        
        switch (task.charAt(0).toUpperCase()) {
            case 'A':
                task = new Asana();
                break;
            case 'G':
                task = new Github;
                break;
            default:
                task = new Jira();
                break;
        }

        await task.prompt();
        if (await task.authentic()) {
            let tasks = await task.select();
        
            for (let i=0; i<Todo.config.includes.length; i++) {
                let include = Todo.config.includes[i].toString().replace('../').replace('./').replace('~/').replace('/');
                
                await Todo.process(`./${include!='undefined'?include:''}`.replace(/\/\.?$/, ''), tasks, task);
            }
        }

        Todo.input.close();
    }

    private static async process(include: string, tasks: object, task: Task) {
        if (!Todo.config.excludes[include]) {
            let files = fs.readdirSync(include, { withFileTypes: true });
            //console.log(files);
            
            for (let f=0; f<files.length; f++) {
                let name = `${include}/${files[f].name}`;

                if (!Todo.config.excludes[name]) {
                    try {
                        let extension = files[f].name.toString().toLowerCase().split('.');
                        
                        if (files[f].isFile() && (Todo.config.extensions['*'] || Todo.config.extensions[extension[extension.length-1]])) {
                            let file = fs.readFileSync(name).toString();
                            //console.log(file);
                            
                            let keywords = Todo.config.keywords.join('|');
                            let match = new RegExp('/[/|\\*]((?!\\*/).)*('+keywords+')((?!\\*/).)+', 'ig');
                            let replace = new RegExp('/[/|\\*]((?!\\*/).)*('+keywords+')', 'i');
                            
                            let todos = file.match(match); //todo implement matchAll
                            for (let t=0; t<todos.length; t++) {
                                let todo = todos[t].replace(replace, '').trim();
                                todo = `${todo.charAt(0).toUpperCase()}${todo.slice(1)} in ${include}/${files[f].name}`;

                                if (!(tasks[todo] || tasks[todo.toLowerCase()])) {
                                    if (await task.insert(todo)) {
                                        tasks[todo] = true;

                                        //todo update keywords with jira task id
                                        
                                        console.log(`( Created ) ${todo}`);
                                    }
                                }
                                else console.log(`(Duplicate) ${todo}`);
                            }
                        }
                        else if (files[f].isDirectory()) {
                            await Todo.process(name, tasks, task);
                        }
                    }
                    catch (error) {
                        //console.log(error)
                    }
                }
            }
        }
    }
}