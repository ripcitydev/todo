import { Task } from './Task';
import { Todo } from './Todo';

const JiraConn = require("jira-connector");

export class Jira implements Task {
    private jira; //todo test jira enterprise
    private host;
    private user;
    private pass;
    
    private project;
    
    public async authentic(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                // Initialize
                this.jira = new JiraConn({
                    host: this.host,
                    basic_auth: {
                        base64: Buffer.from(`${this.user}:${this.pass}`).toString('base64')
                    }
                });

                resolve(true);
            }
            catch (error) {
                console.log(error);
                
                resolve(false);
            }
        });
    }
    
    public async prompt(): Promise<void> {
        return new Promise(async (resolve) => {
            if (Todo.config.jira.hostname)
                this.host = Todo.config.jira.hostname;
            else
                this.host = await Todo.question('Hostname (example.atlassian.net)');

            if (Todo.config.jira.username)
                this.user = Todo.config.jira.username;
            else
                this.user = await Todo.question('Username (example@domain.com)');

            if (Todo.config.jira.password)
                this.pass = Todo.config.jira.password;
            else {
                Todo.output.muted = true;
                process.stdout.write('Password (or API token): ');
                this.pass = await Todo.question('');
                Todo.output.muted = false;
                console.log('');
            }

            if (Todo.config.jira.project)
                this.project = Todo.config.jira.project;
            else
                this.project = await Todo.question('Project');
            
            resolve();
        });
    }
    
    public async select(): Promise<{[key: string]: boolean}> {
        const search = await this.jira.search.search({
            "jql": `project = ${this.project}`,
            "maxResults": 0, //todo check select unlimited field
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
    
    public async insert(summary: string): Promise<number> {
        return new Promise(async (resolve) => {
            let issue;

            let create = {
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
            };
            
            try {
                issue = await this.jira.issue.createIssue(create);
                
                if (issue.id)
                    resolve(issue.id);
            }
            catch (error) {
                create['fields']['project']['key'] = this.project.toUpperCase();
            
                issue = await this.jira.issue.createIssue(create);
                
                if (issue.id)
                    resolve(issue.id);
            }
            
            resolve(0);
        });
    }
}