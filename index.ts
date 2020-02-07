import { Todo } from './Todo';

Todo.parse()
    .then(() => {
        //console.log('');
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        process.exit();
    });