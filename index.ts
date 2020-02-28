import { Todo } from './Todo';

Todo.parse()
    .then(() => {
        console.log('Todo complete!');
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        process.exit();
    });