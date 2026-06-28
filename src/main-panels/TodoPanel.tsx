// Panel to display todo tasks

import type React from "react";
import { formatTimeDifference, type TodoTask } from "../state";

function TodoPanel({ tasks, setDisplayTaskIdx }: { tasks: TodoTask[], setDisplayTaskIdx: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <div className="task-container scrollBox todo-container">
            {tasks.map((task, idx) => {
                return task.visible ?
                    <div key={idx} onClick={() => setDisplayTaskIdx(idx)}
                        className="todo-task" style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}>
                        <p className="wlc">{task.name}</p>
                        {task.scheduled_time && <span className="time wlc">Starts in: {formatTimeDifference(task.scheduled_time)}</span>}
                    </div>
                    : <></>;
            })}
        </div>
    );
}

export default TodoPanel;
