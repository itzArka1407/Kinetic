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
        let new_task: TodoTask | ActiveTask;
        const task_name = formData.get('task-name')?.toString() || '';
        const task_desc = formData.get('task-desc')?.toString() || '';

        const endTime = formData.get('end-time'); // Time when task ends
        const end_time = endTime ? +new Date(endTime.toString()) : 0;

        if (!isCompletedTask(display_task) && submitAction.current === 'save changes') {
            if (isTodoTask(display_task)) {
                const startTime = formData.get('start-time');
                const scheduled_time = startTime ? +new Date(startTime.toString()) : 0;
                if (scheduled_time >= end_time) return; // Not possible
                new_task = { ...display_task, name: task_name, description: task_desc, end_time, scheduled_time } as TodoTask;
            } else if (isActiveTask(display_task)) {
                if (end_time < Date.now()) return; // Not possible
                new_task = { ...display_task, name: task_name, description: task_desc, end_time } as ActiveTask;
            }

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

        } else if (isTodoTask(display_task) && submitAction.current === 'start now') {
            new_task = {
                id: display_task.id,
                name: task_name,
                start_time: Date.now(),
                end_time,
                description: task_desc,
                task_pic_idx: display_task.task_pic_idx,
                visible: display_task.visible,
            } as ActiveTask;

            setTasks(prev_tasks => {
                // Add the new task to the list of active task, remove the todo task from its list
                let updated_tasks = [...prev_tasks];
                updated_tasks[1] = [...updated_tasks[1], new_task];
                updated_tasks[0] = updated_tasks[0].filter((_, idx) => taskIdx !== idx);

                window.localStorage.setItem('kinetic', JSON.stringify(updated_tasks));
                return updated_tasks;
            });

            setTaskIdx(-1); // CRITICAL: To avoid re-rendering of the dialog, solves react's internal race condition
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
                    <button
                        style={{ "--icon-url": "url(./src/assets/send.svg)" } as React.CSSProperties}
                        type="submit"
                        onClick={() => submitAction.current = 'start now'}
                    ><span>Start Now</span></button>
                    <button
                        style={{ "--icon-url": "url(./src/assets/save.svg)" } as React.CSSProperties}
                        type="submit"
                        onClick={() => submitAction.current = 'save changes'}
                    ><span>Save Changes</span></button>
                    <button
                        style={{ "--icon-url": "url(./src/assets/close.svg)" } as React.CSSProperties}
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
