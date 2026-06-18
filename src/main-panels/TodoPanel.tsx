// Panel to display todo tasks

import type React from "react";
import { formatTimeDifference, type Task, type TodoTask } from "../state";

function TodoPanel({ tasks, setSelectedTask }: { tasks: TodoTask[], setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>> }) {
    return (
        <div className="task-container scrollBox todo-container">
            {tasks.map(task => {
                return task.visible ?
                    <div onClick={() => setSelectedTask(task)}
                        className="todo-task" style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}>
                        <p>{task.name}</p>
                        {task.scheduled_time && <span className="time">Starts in: {formatTimeDifference(task.scheduled_time)}</span>}
                    </div>
                    : <></>;
            })}
        </div>
    );
}

export default TodoPanel;
