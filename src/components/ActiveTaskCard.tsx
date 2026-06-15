// Card representing an active task

function ActiveCardTask({ name, task_pic = undefined, task_time_start }: { name: string, task_pic: string | undefined, task_time_start: number }) {
    // TODO: Format the date of start of the task
    return (
        <div>
            <img src={task_pic} alt="task picture" />
            <p>{name}</p>
            <p>{task_time_start}</p>
        </div>
    );
}

export default ActiveCardTask;
