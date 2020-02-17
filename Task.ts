export interface Task {
    prompt(): Promise<void>
    authentic(): Promise<boolean>
    select(summary?: string): Promise<object> //todo add select return type interface
    insert(summary: string): Promise<boolean>
}

//todo add abstract class