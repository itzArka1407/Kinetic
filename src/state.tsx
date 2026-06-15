// Contains shared state of various elements used throughout the app

export type timestamp = number; // Just alias for time stamp -- makes code clearer
export type index = number; // Same, just for code readability

// The pics related to the task thumbnails
export const task_pics: string[] = [];

// A task which is actively running
export interface ActiveTask {
    name: string, // Name of the task
    start_time: timestamp, // Starting time of the task
    end_time: timestamp | undefined, // When the task ends(undefined -> forever)
    task_pic_idx: index, // Index of the task thumbnail(chosen from app's default tasks)
}

// A task which is scheduled for future starting
export interface TodoTask {
    name: string, // Name of the task
    scheduled_time: timestamp | undefined, // Time when the task is supposed to start(undefined -> not decided)
    end_time: timestamp | undefined, // Then the task ends(undefined -> not decided)
    task_pic_idx: index, // Index of the task thumbnail
}

export type Task = TodoTask | ActiveTask;

// TESTING: These are only generated for testing purposes
export function todo_cr(): TodoTask {
    return {
        name: "Test TODO",
        scheduled_time: 1000,
        end_time: 2000,
        task_pic_idx: 0
    };
}

export function act_cr(): ActiveTask {
    return {
        name: "Test ACTIVE",
        start_time: 1000,
        end_time: 2000,
        task_pic_idx: 0,
    };
}
