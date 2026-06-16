// Task which is to be started in the future

import { type TodoTask } from "../state";

function TodoTaskCard({ task }: { task: TodoTask }) {
    // TODO: format the times
    return (
        <div>
            <p>{task.name}</p>
            <p>Scheduled: {task.scheduled_time} - {task.end_time}</p>
        </div>
    );
}

export default TodoTaskCard;
