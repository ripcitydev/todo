import { Task } from './Task';

export class Asana implements Task {
    public async insert(title: string): Promise<boolean> {
        
        
        return true;
    }
}