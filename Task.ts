export interface Task {
    prompt(): Promise<void>
    authentic(): Promise<boolean>
    select(summary?: string): Promise<{[key: string]: boolean}>
    insert(summary: string): Promise<number>
}