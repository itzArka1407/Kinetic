// Panel to display completed tasks

import type React from "react";
import { formatTimeDifference, type CompletedTask } from "../state";

function CompletedPanel({ tasks, setDisplayTaskIdx }: { tasks: CompletedTask[], setDisplayTaskIdx: React.Dispatch<React.SetStateAction<number>> }) {
    // TODO: Complete the complete panel design
    return (
        <div className="task-container scrollBox completed-container">
            {tasks.map((task, idx) => {
                return task.visible ?
                    <div key={idx} onClick={() => setDisplayTaskIdx(idx)}
                        className="completed-task"
                        style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}
                    >
                        <p className="wlc">{task.name}</p>
                        <span className="time wlc">Completed: {formatTimeDifference(task.completed_time)} ago</span>
                    </div>
                    : <></>;
            })}
        </div>
    );
}

export default CompletedPanel;
