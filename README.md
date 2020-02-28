# Todo
Todo parses the todo’s and fixme’s in your code, and imports them into Jira.

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

Keywords - keywords to parse, currently supports todo and fixme.

Includes - directories to include.

Excludes - directories and/or files to exclude.

Extensions - file extensions to include and parse.

Jira - an object of authentication properties.<br />
     - hostname (example.atlassian.net)<br />
     - username (example@domain.com)<br />
     - password for legacy server version or API token for jira cloud.<br />
     - project

Github - in development

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