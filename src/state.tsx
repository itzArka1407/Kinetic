// Contains shared state of various elements used throughout the app

import { useEffect, useState } from "react";

export type timestamp = number; // Just alias for time stamp -- makes code clearer
export type index = number; // Same, just for code readability

// A task which is actively running
export interface ActiveTask {
    name: string, // Name of the task
    description: string, // Task description
    start_time: timestamp, // Starting time of the task
    end_time: timestamp | undefined, // When the task ends(undefined -> forever)
    task_pic_idx: index, // Index of the task thumbnail(chosen from app's default tasks)
    visible: boolean, // If the task is to be displayed in UI
}

// A task which is scheduled for future starting
export interface TodoTask {
    name: string, // Name of the task
    description: string, // Task description
    scheduled_time: timestamp | undefined, // Time when the task is supposed to start(undefined -> not decided)
    end_time: timestamp | undefined, // Then the task ends(undefined -> not decided)
    task_pic_idx: index, // Index of the task thumbnail
    visible: boolean, // If the task is to be displayed in UI
}

// A task which is completed
export interface CompletedTask {
    name: string, // Name of task
    description: string, // Task description
    completed_time: timestamp, // When the task was completed
    task_pic_idx: index, // Index of task thumbnail
    visible: boolean, // If the task is to be displayed in UI
}

export type Task = TodoTask | ActiveTask | CompletedTask;

// Input a time(since epoch) and check the difference from present
export function formatTimeDifference(time: timestamp): string {
    const absDiff = Math.abs(Date.now() - time);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.437); // Average days in a month
    const years = Math.floor(days / 365.25);

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}M`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${Math.max(1, seconds)}s`; // Defaults to seconds, minimum 1s
}

export function useCurrentDateTimeConstraint() {
    const [minDateTime, setMinDateTime] = useState('');

    useEffect(() => {
        const calculateCurrentTime = () => {
            const now = new Date();

            // Format to strict: YYYY-MM-DDTHH:MM
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        // Initialize immediately on mount
        setMinDateTime(calculateCurrentTime());
    }, []);

    return minDateTime;
}

export const formatTimestampForInput = (timestamp: timestamp | undefined): string => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    // Adjust for local timezone offset so toISOString() outputs local time numbers
    const tzOffsetMs = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffsetMs);

    // slice(0, 16) extracts exactly "YYYY-MM-DDTHH:mm"
    return localDate.toISOString().slice(0, 16);
};
