# Todo
<p>Todo parses the todo’s and fixme’s in your code, and imports them into Jira or GitHub (Issues).</p><p>Todo's must be in line or block comment to parse, supported comment types include #, --, //, and /**/.</p>

## Installing

Locally
```
npm install @ripcitydev/todo --save-dev
```
or Globally
```
npm install @ripcitydev/todo -g
```

## Configuring

* Keywords - keywords to parse (default: todo, fixme).
* Includes - relative directories to include (default: current directory, rescursive).
* Excludes - relative directories and/or files to exclude (default: .git, build, node_modules, package.json).
* Extensions - file extensions to include and parse (default: js, ts).
* Jira - an object of authentication properties ([Create an API token](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)).
  * hostname (example.atlassian.net)
  * username (case-sensitive, or email)
  * password ([legacy server version or API token for jira cloud](https://www.npmjs.com/package/jira-connector))
  * project (name)
* Github - an object of authentication properties ([Creating a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)).
  * hostname (api.github.com or [hostname]/api/v3 for [enterprise](https://developer.github.com/enterprise/2.17/v3/#authentication))
  * username (or email)
  * password (or OAuth token)
  * organization (or owner)
  * repository (name)
* Asana - in development

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

## Testing

* Jira Cloud (pass)
* Jira Enterprise (pass)
* GitHub Enterprise (pass)
* GitHub (pass)