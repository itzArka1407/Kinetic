// Displaying panel for active tasks

import { formatTimeDifference, type ActiveTask } from "../state";

function ActivePanel({ tasks }: { tasks: ActiveTask[] }) {
    return (
        <div className="task-container scrollBox active-container">
            {tasks.map(task => {
                return <div className="todo-task" style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}>
                    <p>{task.name}</p>
                    {task.start_time
                        && task.end_time
                        && <span className="time">
                            Started: {formatTimeDifference(task.start_time)} ago
                            | Ends in: {formatTimeDifference(task.end_time)}
                        </span>}
                </div>;
            })}
        </div>
    );
}

export default ActivePanel;
