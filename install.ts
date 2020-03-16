import { Todo } from './Todo';

const fs = require('fs');

if (!process.env.npm_config_global) {
    try {
        const config = JSON.parse(fs.readFileSync(`${process.env.INIT_CWD}/package.json`));

        if (config['name'] != '@ripcitydev/todo') {
            config['scripts']['todo'] = './node_modules/.bin/todo';

            fs.writeFileSync(`${process.env.INIT_CWD}/package.json`, JSON.stringify(config, null, '  '));

            //fs.closeSync();
        }
    }
    catch (error) {
        console.log(error);
    }
}

Todo.init();

process.exit();