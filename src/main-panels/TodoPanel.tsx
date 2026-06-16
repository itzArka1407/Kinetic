// Panel to display todo tasks

import { formatTimeDifference, type TodoTask } from "../state";

function TodoPanel({ tasks }: { tasks: TodoTask[] }) {
    return (
        <div>
            {tasks.map(task => {
                return <div className="todo-task" style={{ "--icon-url": `url(./src/assets/TasksThumbnails/${task.task_pic_idx}.webp)` } as React.CSSProperties}>
                    <p>{task.name}</p>
                    {task.scheduled_time && <span className="time">Starts in: {formatTimeDifference(task.scheduled_time)}</span>}
                </div>;
            })}
        </div>
    );
}

export default TodoPanel;
