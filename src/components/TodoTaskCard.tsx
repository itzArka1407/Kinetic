// Task which is to be started in the future

import { task_pics, type TodoTask } from "../state";

function TodoTaskCard({ task }: { task: TodoTask }) {
    // TODO: format the times
    return (
        <div>
            <img src={task_pics[task.task_pic_idx]} alt="Task" />
            <p>{task.name}</p>
            <p>Scheduled: {task.scheduled_time} - {task.end_time}</p>
        </div>
    );
}

export default TodoTaskCard;
