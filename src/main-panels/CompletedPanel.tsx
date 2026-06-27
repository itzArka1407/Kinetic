// Panel to display completed tasks

import type React from "react";
import { formatTimeDifference, type CompletedTask, type Task } from "../state";

function CompletedPanel({ tasks, setSelectedTask }: { tasks: CompletedTask[], setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>> }) {
    // TODO: Complete the complete panel design
    return (
        <div className="task-container scrollBox completed-container">
            {tasks.map((task, idx) => {
                return task.visible ?
                    <div key={idx} onClick={() => setSelectedTask(task)}
                        className="completed-task"
                        style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}
                    >
                        <p className="wlc">{task.name}</p>
                        <span>Completed: {formatTimeDifference(task.completed_time)} ago</span>
                    </div>
                    : <></>;
            })}
        </div>
    );
}

export default CompletedPanel;
