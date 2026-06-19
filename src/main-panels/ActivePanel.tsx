// Displaying panel for active tasks

import type React from "react";
import { formatTimeDifference, type ActiveTask, type Task } from "../state";

function ActivePanel({ tasks, setSelectedTask }: { tasks: ActiveTask[], setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>> }) {
    return (
        <div className="task-container scrollBox active-container">
            {tasks.map(task => {
                return task.visible ?
                    <div onClick={() => setSelectedTask(task)}
                        className="todo-task" style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}>
                        <p className="wlc">{task.name}</p>
                        {task.start_time
                            && task.end_time
                            && <span className="time wlc">
                                Started: {formatTimeDifference(task.start_time)} ago
                                | Ends in: {formatTimeDifference(task.end_time)}
                            </span>}
                    </div>
                    : <></>;
            })}
        </div>
    );
}

export default ActivePanel;
