//import { Asana } from './Asana';
import { Jira } from './Jira';

import { Task } from './Task';

const fs = require('fs');

export class Todo {
    private static config = JSON.parse(fs.readFileSync('./package.json')).todo;
    
    public static async parse() {
        let task;
        switch ('jira'.toString()) { //todo implement dynamic platform switch
            case 'jira':
                task = new Jira();
                break;
            case 'asana': //todo impement Asana class
                //task = new Asana();
                break;
            case 'github': //todo implement Github class
                //task = new Github;
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
    }

    private static async process(include: string, tasks: object, task: Task) {
        let excludes = {}; //todo functionalize excludes
        for (let e=0; e<Todo.config.excludes.length; e++) {
            let exclude = Todo.config.excludes[e].toString().replace('../').replace('./').replace('~/').replace('/');
            
            excludes[`./${exclude!='undefined'?exclude:''}`.replace(/\/\.?$/, '')] = true;
        }

        let extensions = {}; //todo functionalize extensions
        for (let e=0; e<Todo.config.extensions.length; e++) {
            let extension = Todo.config.extensions[e].toString().toLowerCase().split('.');

            extensions[extension[extension.length-1]] = true;
        }
        
        if (!excludes[include]) {
            let files = fs.readdirSync(include, { withFileTypes: true });
            //console.log(files);
            
            for (let f=0; f<files.length; f++) {
                let name = `${include}/${files[f].name}`;

                if (!excludes[name]) {
                    try {
                        let extension = files[f].name.toString().toLowerCase().split('.');
                        
                        if (files[f].isFile() && (extensions['*'] || extensions[extension[extension.length-1]])) {
                            let file = fs.readFileSync(name).toString();
                            //console.log(file);
                            
                            /*todo fix multi-line comments*/
                            let todos = file.match(/\/(\/|\*).*todo(.+)/ig); //todo implement matchAll
                            for (let t=0; t<todos.length; t++) {
                                let todo = todos[t].replace(/\/(\/|\*).*todo/, '').replace(/\*\/.*/, '').trim();
                                todo = `${todo.charAt(0).toUpperCase()}${todo.slice(1)} in ${include}/${files[f].name}`;

                                if (!(tasks[todo] || tasks[todo.toLowerCase()])) {
                                    if (await task.insert(todo)) {
                                        tasks[todo] = true;

                                        console.log(`(Created) ${todo}`);
                                    }
                                }
                                else console.log(`(Skipped) ${todo}`);
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