const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./package.json'));

config['todo'] = {
    includes: ['.'],
    excludes: ['.git', 'node_modules', 'package.json'],
    extensions: ['*']
}

fs.writeFileSync('./package.json', JSON.stringify(config, null, '\t'));

//console.log(config);