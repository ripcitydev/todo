import { Task } from './Task';
import { Todo } from './Todo';

const readline = require('readline');
const Writable = require('stream').Writable;

const mutableStdout = new Writable({
    write: function(chunk, encoding, callback) {
        if (!this.muted)
            process.stdout.write(chunk, encoding);

        callback();
    }
});

mutableStdout.muted = false;

const JiraClient = require("jira-connector");

export class Jira implements Task {
    private jira;
    private host;
    private user;
    private pass;
    private line;
    
    private project;
    
    public async authentic(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                // Initialize
                this.jira = new JiraClient({
                    host: this.host,
                    basic_auth: {
                        base64: Buffer.from(`${this.user}:${this.pass}`).toString('base64')
                    }
                });

                resolve(true);
            }
            catch (error) {
                resolve(false);
            }
        });
    }
    
    public async prompt(): Promise<void> {
        return new Promise(async (resolve) => {
            this.line = readline.createInterface({
                input: process.stdin,
                output: mutableStdout,
                terminal: true
            });

            //todo add platform prompt
            if (Todo.config.jira.hostname)
                this.host = Todo.config.jira.hostname;
            else
                this.host = await this.question('hostname (example.atlassian.net)');

            if (Todo.config.jira.username)
                this.user = Todo.config.jira.username;
            else
                this.user = await this.question('username (example@domain.com)');

            if (Todo.config.jira.password)
                this.pass = Todo.config.jira.password;
            else {
                mutableStdout.muted = true;
                process.stdout.write('password (API token): ');
                this.pass = await this.question('');
                mutableStdout.muted = false;
                console.log('');
            }

            if (Todo.config.jira.project)
                this.project = Todo.config.jira.project;
            else
                this.project = await this.question('project');

            this.line.close();
            
            resolve();
        });
    }

    private async question(text: string) {
        return new Promise((resolve) => {
            this.line.question(`${text}: `, (answer) => {
                //console.log(`${answer}`);

                resolve(answer);
            });
        });
    }
    
    public async select(): Promise<object> { //todo add select project uppercase snippet
        const search = await this.jira.search.search({
            "jql": `project = ${this.project}`,
            "maxResults": 0, //todo double-check select unlimited field
            "fields": [
              "summary",
              "status"
            ],
            "startAt": 0
        });

        let issues = {};
        for (let i=0; i<search.issues.length; i++) {
            issues[search.issues[i].fields.summary.toString().toLowerCase()] = true;
        }
        
        //console.log(issues);
        
        return issues;
    }
    
    public async insert(summary: string): Promise<boolean> { //todo add insert project uppercase snippet
        return new Promise(async (resolve) => {
            try {
                const issue = await this.jira.issue.createIssue({
                    "fields": {
                        "project": {
                            "key": this.project
                        },
                        "summary": summary,
                        //"description": "Creating of an issue using project keys and issue type names using the REST API",
                        "issuetype": {
                            "name": "Task"
                        }
                    }
                });

                if (issue.id)
                    resolve(true);
            }
            catch (error) {
                console.log(error);
            }
            
            resolve(false);
        });
    }
}