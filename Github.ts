import { Task } from './Task';

export class Github implements Task {
    public async authentic(): Promise<boolean> {


        return ;
    }

    public async prompt(): Promise<void> {
        console.log('Github support in development.');

        return ;
    }

    public async select(summary?: string): Promise<{[key: string]: boolean}> {


        return ;
    }
    
    public async insert(summary: string): Promise<number> {
        
        
        return ;
    }
}