// Card representing an active task

import { type ActiveTask } from "../state";

function ActiveCardTask({ task }: { task: ActiveTask }) {
    // TODO: Format the date of start of the task
    return (
        <div>
            <p>{task.name}</p>
            <p>{task.start_time}</p>
        </div>
    );
}

export default ActiveCardTask;
