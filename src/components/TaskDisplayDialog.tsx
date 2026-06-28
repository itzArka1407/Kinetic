// To display a task that is already created
import React, { useEffect, useRef, type SubmitEvent } from "react";
import { formatTimeDifference, formatTimestampForInput, useCurrentDateTimeConstraint, type ActiveTask, type CompletedTask, type Task, type TodoTask } from "../state";
import TextAreaWrapper from "./TextAreaWrapper";

function DisplayTaskDialog(
    { tasks, setTasks, panelIdx, taskIdx, setTaskIdx }
        : {
            tasks: Task[][],
            setTasks: React.Dispatch<React.SetStateAction<Task[][]>>,
            panelIdx: number,
            taskIdx: number,
            setTaskIdx: React.Dispatch<React.SetStateAction<number>>
        }
) {
    // Tasks only exist for the first 3 panels
    const display_task: Task | null = panelIdx < 3 ? tasks[panelIdx][taskIdx] : null;
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Checks if a task is a completed task(used for UI designs)
    function isCompletedTask(_task: Task | null): _task is CompletedTask {
        return panelIdx === 2;
    }

    // Checks if a task is an active task
    function isActiveTask(_task: Task | null): _task is ActiveTask {
        return panelIdx === 1;
    }

    // Checks if a task is a todo task
    function isTodoTask(_task: Task | null): _task is TodoTask {
        return panelIdx === 0;
    }

    const submitAction = useRef<'cancel' | 'start now' | 'save changes'>('cancel'); // The action performed on the dialog
    useEffect(() => {
        submitAction.current = 'cancel'; // Per new task, the submit action is refreshed
        if (display_task) dialogRef.current?.showModal();
    }, [display_task]);

    function formSubmitAction(ev: SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        const task_name = formData.get('task-name')?.toString() || '';
        const task_desc = formData.get('task-desc')?.toString() || '';

        const new_task = { ...display_task, name: task_name, description: task_desc } as ActiveTask | TodoTask;

        // Update with new set of tasks: both in UI and local storage
        setTasks(prev_tasks => {
            const updated_tasks = prev_tasks.with(
                panelIdx,
                prev_tasks[panelIdx].with(taskIdx, new_task)
            );

            // Store in local storage
            window.localStorage.setItem('kinetic', JSON.stringify(updated_tasks));
            return updated_tasks;
        });

        if (submitAction.current === 'save changes') {
            // TODO: Set the new task
        } else if (submitAction.current === 'start now') {
            // TODO: Modify the starting time of the task to start it now
        }

        dialogRef.current?.close(); // Close the dialog
    }

    function onClose() { setTaskIdx(-1) }; // For the dialog's closing event

    const imageSrc = `./src/assets/TasksThumbnails/${display_task?.task_pic_idx}.webp`;
    const currentDateTimeLocal = useCurrentDateTimeConstraint();

    // The scheduled_time field is searched in the task -- it is only possible for a Todo task
    return (
        <dialog
            id="task-display-dialog"
            className="entry-anim"
            ref={dialogRef}
            onClose={onClose}
            key={display_task ? display_task.id : 'closed'}
        >
            {display_task && <form
                onSubmit={formSubmitAction}
            >
                <main className="scrollBox no-scrollbar">
                    <div className="img-wrapper">
                        <img src={imageSrc} />
                        <input
                            type="text"
                            defaultValue={display_task?.name}
                            readOnly={isCompletedTask(display_task)}
                            placeholder="Task Name"
                            name="task-name"
                            required
                        />
                        <TextAreaWrapper
                            readOnly={isCompletedTask(display_task)}
                            defaultValue={display_task?.description}
                        />
                    </div>

                    {isTodoTask(display_task) && <div className="time-wrapper">
                        <label htmlFor="task-stored-start-time">Scheduled Time</label>
                        <input
                            type="datetime-local"
                            id="task-stored-start-time"
                            min={currentDateTimeLocal}
                            defaultValue={formatTimestampForInput(display_task.scheduled_time)}
                            name="start-time"
                            required
                        />
                    </div>}

                    {!isCompletedTask(display_task) && <div className="time-wrapper">
                        <label htmlFor="task-stored-end-time">Ends at</label>
                        <input
                            type="datetime-local"
                            id="task-stored-end-time"
                            min={currentDateTimeLocal}
                            defaultValue={formatTimestampForInput(display_task.end_time)}
                            name="end-time"
                            required
                        />
                    </div>}

                    {isCompletedTask(display_task) && <div className="time-wrapper">
                        <span>Completed: {formatTimeDifference(display_task.completed_time)} ago</span>
                    </div>}
                </main>
                <div
                    className={isCompletedTask(display_task) ? 'compl' : isActiveTask(display_task) ? 'act' : 'todo'}
                >
                    <button type="submit" onClick={() => submitAction.current = 'start now'}><span>Start Now</span></button>
                    <button type="submit" onClick={() => submitAction.current = 'save changes'}><span>Save Changes</span></button>
                    <button
                        type="submit"
                        formNoValidate
                        onClick={() => submitAction.current = 'cancel'}
                    ><span>{isCompletedTask(display_task) ? 'Close' : 'Cancel'}</span>
                    </button>
                </div>
            </form>}
        </dialog>
    );
}

export default DisplayTaskDialog;
