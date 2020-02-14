export interface Task {
    prompt(): Promise<void>
    authentic(): Promise<boolean>
    select(summary?: string): Promise<object>
    insert(summary: string): Promise<boolean>
}