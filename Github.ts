import { Task } from './Task';
import { Todo } from './Todo';

const GitHubAPI = require('github-api');

export class Github implements Task {
    private github;
    
    private host;
    private user;
    private pass;
    private repo;

    private org;

    public async authentic(): Promise<boolean> {
        return new Promise(async (resolve) => {
            try {
                // basic auth
                const github = new GitHubAPI({
                username: this.user,
                password: this.pass
                /* also acceptable: */
                //token: this.pass
                }, `https://${this.host?this.host:'api.github.com'}`.replace(/\/$/, ''));

                this.github = github.getIssues(this.org, this.repo);
                
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
            if (Todo.config.github.hostname)
                this.host = Todo.config.github.hostname;
            else
                this.host = await Todo.question('Hostname (api.github.com)');

            if (Todo.config.github.username)
                this.user = Todo.config.github.username;
            else
                this.user = await Todo.question('Username (or email)');

            if (Todo.config.github.password)
                this.pass = Todo.config.github.password;
            else {
                Todo.output.muted = true;
                process.stdout.write('Password (or OAuth token): ');
                this.pass = await Todo.question('');
                Todo.output.muted = false;
                console.log('');
            }

            if (Todo.config.github.organization)
                this.org = Todo.config.github.organization;
            else
                this.org = await Todo.question('Organization (or owner)');

            if (Todo.config.github.repository)
                this.repo = Todo.config.github.repository;
            else
                this.repo = await Todo.question('Repository');
            
            resolve();
        });
    }

    public async select(summary?: string): Promise<{[key: string]: boolean}> {
        const issues = await this.github.listIssues({
            filter: 'all',
            state: 'all'
        });

        //console.log(issues);
        
        let select = {};
        for (let i=0; i<issues.data.length; i++) {
            select[Todo.metaphone(issues.data[i].title.toString())] = true;
        }

        //console.log(select);

        return select;
    }
    
    public async insert(title: string): Promise<number> {
        return new Promise(async (resolve) => {
            const issue = await this.github.createIssue({
                title: title
            });
            
            if (issue.data.id)
                resolve(issue.data.id);
            
            resolve(0);
        });
    }
}