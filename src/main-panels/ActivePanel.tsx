// Displaying panel for active tasks

import type React from "react";
import { formatTimeDifference, type ActiveTask } from "../state";

function ActivePanel({ tasks, setDisplayTaskIdx }: { tasks: ActiveTask[], setDisplayTaskIdx: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <div className="task-container scrollBox active-container">
            {tasks.map((task, idx) => {
                return task.visible ?
                    <div key={idx} onClick={() => setDisplayTaskIdx(idx)}
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
