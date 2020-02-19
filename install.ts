import { Todo } from './Todo';

if (!process.env.npm_config_global) {
    try {
        const fs = require('fs');
        
        const config = JSON.parse(fs.readFileSync(`${process.env.INIT_CWD}/package.json`));

        //todo add global install conditional
        config['scripts']['todo'] = './node_modules/.bin/todo';

        fs.writeFileSync(`${process.env.INIT_CWD}/package.json`, JSON.stringify(config, null, '  '));
    }
    catch (error) {
        console.log(error);
    }
}

Todo.init(true);