# Todo
Todo parses the todo’s and fixme’s in your code, and imports them into Jira or GitHub (Issues).

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

* Keywords - keywords to parse.

* Includes - directories to include.

* Excludes - directories and/or files to exclude.

* Extensions - file extensions to include and parse.

* Jira - an object of authentication properties.
  * hostname (example.atlassian.net)
  * username (case-sensitive, or email)
  * password ([legacy server version or API token for jira cloud](https://www.npmjs.com/package/jira-connector))
  * project (name)

  [Create an API token](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)

* Github - an object of authentication properties.
  * hostname (api.github.com or [hostname]/api/v3 for [enterprise](https://developer.github.com/enterprise/2.17/v3/#authentication))
  * username (or email)
  * password (or OAuth token)
  * organization (or owner)
  * repository (name)

  [Creating a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

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