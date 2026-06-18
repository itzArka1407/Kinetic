// Dialog to create a todo task
import React, { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useCurrentDateTimeConstraint, type ActiveTask, type Task, type TodoTask } from "../state";
import TextAreaWrapper from "./TextAreaWrapper";

function TaskCreationDialog(
    { setTasks, panelIdx, actionState, setActionState }:
        {
            setTasks: React.Dispatch<React.SetStateAction<Task[][]>>,
            panelIdx: number,
            actionState: 'task creation' | 'search-mode' | null,
            setActionState: React.Dispatch<React.SetStateAction<typeof actionState>>
        }
) {
    const [selectedImgIdx, setSelectedImgIdx] = useState(1); // The index of the image that is set as wallpaper for the task
    const submitAction = useRef<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (actionState === 'task creation') {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
            submitAction.current = null; // Clear out the submit action state
            setSelectedImgIdx(1); // Set to the first image selected as wallpaper for the new task
        }
    }, [actionState]);

    const formSubmissionFn = (ev: SubmitEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!selectedImgIdx) return; // SAFETY: NOT POSSIBLE functionally -- just to assure.
        const formData = new FormData(ev.currentTarget);

        // Only perform operations if a task is to be created
        if (submitAction.current === 'submit') {
            const name = formData.get('task-name') as string;
            const description = formData.get('task-desc') as string;
            const starting_time = Date.parse(formData.get('start-time') as string) || Date.now(); // For active tasks, this is Date.now(0
            const ending_time = Date.parse(formData.get('end-time') as string);

            if (starting_time < Date.now() || ending_time < starting_time) return; // Invalid inpus

            let new_task: ActiveTask | TodoTask = panelIdx === 1 ? {
                name: name,
                description: description,
                start_time: starting_time,
                end_time: ending_time,
                task_pic_idx: selectedImgIdx,
            } : {
                name: name,
                description: description,
                scheduled_time: starting_time,
                end_time: ending_time,
                task_pic_idx: selectedImgIdx,
            };

            setTasks(prev_tasks => {
                const new_tasks = [...prev_tasks[panelIdx], new_task];
                return prev_tasks.with(panelIdx, new_tasks);
            });
        }
        ev.currentTarget.reset(); // Reset the form fields
        setActionState(null);
    }

    const currentDateTimeLocal = useCurrentDateTimeConstraint();
    return (
        <dialog ref={dialogRef} id="task-creation-dialog">
            <h2>Create Task:</h2>
            <form onSubmit={formSubmissionFn}>
                <input type="text" name="task-name" placeholder="Task Name" required />

                <TextAreaWrapper defaultValue={actionState ? "" : undefined} />

                {panelIdx === 0 && <div className="time-wrapper">
                    <label htmlFor="task-start-time">Scheduled Time</label>
                    <input type="datetime-local" id="task-start-time" min={currentDateTimeLocal} name="start-time" required />
                </div>}

                <div className="time-wrapper">
                    <label htmlFor="task-end-time">Ends at</label>
                    <input type="datetime-local" id="task-end-time" min={currentDateTimeLocal} name="end-time" required />
                </div>

                <TaskImages selImgIdx={selectedImgIdx} setImgIdx={setSelectedImgIdx} />

                <div className="btnBox">
                    <button
                        type="submit"
                        onClick={() => submitAction.current = 'submit'}>
                    </button>
                    <button
                        type="submit"
                        formNoValidate
                        onClick={() => submitAction.current = 'cancel'}>
                    </button>
                </div>
            </form>
        </dialog>
    );
}

function TaskImages({ selImgIdx, setImgIdx }: { selImgIdx: number, setImgIdx: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <div className="task-images-panel">
            <h2>Select Wallpaper:</h2>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(idx => {
                let image_path = `./src/assets/TasksThumbnails/${idx}.webp`;
                console.log('Img idx: ', selImgIdx); // testing
                return <img key={idx} src={image_path} className={selImgIdx === idx ? 'selected' : undefined} onClick={() => { setImgIdx(idx) }} />;
            })}
        </div>
    );
}

export default TaskCreationDialog;
