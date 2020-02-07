const fs = require('fs');

export class Todo {
    public static async parse() {
        const files = fs.readdirSync('.'); //todo add includes
        //console.log(files);
        
        for (let f=0; f<files.length; f++) {
            try {
                let file = fs.readFileSync(files[f]).toString(); //todo add excludes
                //console.log(file);
                
                let todos = file.match(/\/\/ ?todo(.+)/ig);
                for (let t=0; t<todos.length; t++) {
                    console.log(todos[t].replace(/\/\/ ?todo/, '').trim());
                }
            }
            catch (error) {
                //console.log(error)
            }
        }
        
        return true;
    }
}