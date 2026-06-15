// Panel to display todo tasks

import { type TodoTask } from "../state";

function TodoPanel({ tasks }: { tasks: TodoTask[] }) {
    return (
        <div>
            {tasks.map(task => {
                return <div>
                    <p>{task.name}</p>
                    <p>{task.scheduled_time}</p>
                </div>;
            })}
        </div>
    );
}

export default TodoPanel;
