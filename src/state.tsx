// Contains shared state of various elements used throughout the app

export type timestamp = number; // Just alias for time stamp -- makes code clearer

export interface ActiveTask {
    name: string, // Name of the task
    start_time: timestamp, // Starting time of the task
    task_pic_idx: number, // Index of the task thumbnail(chosen from app's default tasks)
}

