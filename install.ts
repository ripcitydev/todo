const fs = require('fs');

const config = JSON.parse(fs.readFileSync(`${process.env.INIT_CWD}/package.json`));

config['scripts']['todo'] = './node_modules/.bin/todo';

config['todo'] = {
    includes: ['.'],
    excludes: ['.git', 'node_modules', 'package.json'],
    extensions: ['*']
}

fs.writeFileSync(`${process.env.INIT_CWD}/package.json`, JSON.stringify(config, null, '  '));

//console.log(config);