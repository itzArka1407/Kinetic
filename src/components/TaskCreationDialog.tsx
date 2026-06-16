// Dialog to create a todo task
import { useRef, useState, type SubmitEvent } from "react";
import { type ActiveTask, type Task, type TodoTask } from "../state";

function TaskCreationDialog(
    { setTasks, dialogRef, panelIdx }:
        { setTasks: React.Dispatch<React.SetStateAction<Task[][]>>, dialogRef: React.RefObject<HTMLDialogElement | null>, panelIdx: number }
) {
    const [selectedImgIdx, setSelectedImgIdx] = useState(1); // The index of the image that is set as wallpaper for the task
    const submitAction = useRef<string | null>(null);

    const formSubmissionFn = (ev: SubmitEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!selectedImgIdx) return; // SAFETY: NOT POSSIBLE functionally -- just to assure.
        const formData = new FormData(ev.currentTarget);

        // Only perform operations if a task is to be created
        if (submitAction.current === 'submit') {
            const name = formData.get('task-name') as string;
            const description = formData.get('task-desc') as string;
            const starting_time = Date.parse(formData.get('start-time') as string) || undefined;
            const ending_time = Date.parse(formData.get('end-time') as string) || undefined;

            console.log(panelIdx); // testing
            let new_task: ActiveTask | TodoTask = panelIdx === 1 ? {
                name: name,
                description: description,
                start_time: Date.now(), // Active task is added NOW
                end_time: ending_time,
                task_pic_idx: selectedImgIdx,
            } : {
                name: name,
                description: description,
                scheduled_time: starting_time,
                end_time: ending_time,
                task_pic_idx: selectedImgIdx,
            };
            console.log(new_task); // testing

            setTasks(prev_tasks => {
                const new_tasks = [...prev_tasks[panelIdx], new_task];
                return prev_tasks.with(panelIdx, new_tasks);
            });
        }
        dialogRef.current?.close();
    }

    return (
        <dialog ref={dialogRef} id="task-creation-dialog">
            <h2>Create Task:</h2>
            <form onSubmit={formSubmissionFn}>
                <input type="text" name="task-name" placeholder="Task Name" required />
                <div className="desc-container">
                    <textarea name="task-desc" maxLength={500} placeholder="Description..." />
                </div>

                <div>
                    {panelIdx == 0 && <label htmlFor="task-start-time">Scheduled Time</label>}
                    <input type="datetime-local" id="task-start-time" name="start-time" required />
                </div>
                <div>
                    <label htmlFor="task-end-time">Ends at</label>
                    <input type="datetime-local" id="task-end-time" name="end-time" required />
                </div>

                <TaskImages selImgIdx={selectedImgIdx} setImgIdx={setSelectedImgIdx} />

                <div className="btnBox">
                    <button type="submit" onClick={() => submitAction.current = 'submit'}></button>
                    <button type="submit" formNoValidate onClick={() => submitAction.current = 'cancel'}></button>
                </div>
            </form>
        </dialog>
    );
}

function TaskImages({ selImgIdx, setImgIdx }: { selImgIdx: number, setImgIdx: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <div className="task-images-panel">
            <h2>Select Wallpaper:</h2>
            {[1, 2, 3, 4, 5].map(idx => {
                let image_path = `./src/assets/TasksThumbnails/${idx}.webp`;
                console.log('Img idx: ', selImgIdx); // testing
                return <img key={idx} src={image_path} className={selImgIdx === idx ? 'selected' : undefined} onClick={() => { setImgIdx(idx) }} />;
            })}
        </div>
    );
}

export default TaskCreationDialog;
