// To display a task that is already created
import React, { useEffect, useRef, type SubmitEvent } from "react";
import { formatTimeDifference, formatTimestampForInput, useCurrentDateTimeConstraint, type Task, type timestamp } from "../state";
import TextAreaWrapper from "./TextAreaWrapper";

function DisplayTaskDialog(
    { display_task, setDisplayTask }
        : {
            display_task: Task | null,
            setDisplayTask: React.Dispatch<React.SetStateAction<Task | null>>
        }
) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Checks if a task is a completed task(used for UI designs)
    function isCompletedTask(task: Task | null): task is Task & { completed_time: timestamp } {
        return !!task && 'completed_time' in task;
    }

    useEffect(() => {
        if (display_task) dialogRef.current?.showModal();
    }, [display_task]);

    const submitAction = useRef<string | null>(null); // The action performed on the dialog
    // TODO: Perform the submit action for the form
    function formSubmitAction(ev: SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        const formData = new FormData(ev.currentTarget);
        const task_name = formData.get('task-name');
        const task_desc = formData.get('task-desc');

        if (submitAction.current === 'save changes') {
            // TODO: Set the new task
        } else if (submitAction.current === 'start now') {
            // TODO: Modify the starting time of the task to start it now
        }

        // Resetting phase after operations
        ev.currentTarget.reset(); // Clear out the form components
        dialogRef.current?.close(); // Close the dialog
    }

    function onClose() { setDisplayTask(null) }; // For the dialog's closing event

    const imageSrc = `./src/assets/TasksThumbnails/${display_task?.task_pic_idx}.webp`;
    const currentDateTimeLocal = useCurrentDateTimeConstraint();

    // The scheduled_time field is searched in the task -- it is only possible for a Todo task
    return (
        <dialog id="task-display-dialog" className="entry-anim" ref={dialogRef} onClose={onClose}>
            <form onSubmit={formSubmitAction}>
                <main className="scrollBox no-scrollbar">
                    <div className="img-wrapper">
                        <img src={imageSrc} />
                        <input
                            type="text"
                            defaultValue={display_task?.name}
                            readOnly={isCompletedTask(display_task)}
                            placeholder="Task Name"
                            name="task-name"
                        />
                        <TextAreaWrapper
                            readOnly={isCompletedTask(display_task)}
                            defaultValue={display_task?.description}
                        />
                    </div>

                    {display_task && 'scheduled_time' in display_task && <div className="time-wrapper">
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

                    {display_task && 'end_time' in display_task && <div className="time-wrapper">
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
                <div>
                    <button type="submit" onClick={() => submitAction.current = 'start now'}><span>Start Now</span></button>
                    <button type="submit" onClick={() => submitAction.current = 'save changes'}><span>Save Changes</span></button>
                    <button type="submit" formNoValidate onClick={() => submitAction.current = 'cancel'}><span>Cancel</span></button>
                </div>
            </form>
        </dialog>
    );
}

export default DisplayTaskDialog;
