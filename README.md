# Todo
Todo parses the todo’s and fixme’s in your code, and imports them into Jira or GitHub (Issues).

## Installing

Locally
```
npm install @ripcitydev/todo —save-dev
```
or Globally
```
npm install @ripcitydev/todo -g
```

## Configuring

Keywords - keywords to parse.

Includes - directories to include.

Excludes - directories and/or files to exclude.

Extensions - file extensions to include and parse.

Jira - an object of authentication properties.<br />
     - hostname (example.atlassian.net)<br />
     - username (example@domain.com)<br />
     - password for legacy server version or API token for jira cloud.<br />
     - project

Github - an object of authentication properties.<br />
     - hostname (api.github.com)<br />
     - username (or email)<br />
     - password (or OAuth token)<br />
     - organization (or owner)<br />
     - repository

Asana - in development

To change the defaults, edit todo.json.

## Running

Locally
```
npm run todo
```
or Globally
```
todo
```