import { useEffect, useRef } from "react";
import type { ActionState } from "../stores/state_types";
import { scaleToFit } from "../stores/scale_fn";

function NotepadDialog({ actionState, setActionState }: { actionState: ActionState, setActionState: React.Dispatch<React.SetStateAction<ActionState>> }) {
    // TODO: Make the saving function

    let dialogRef = useRef<HTMLDialogElement | null>(null); // The main dialog element
    useEffect(() => {
        // Alter the modal state whenever the action state changes
        if (actionState === 'notepad') {
            dialogRef.current?.showModal();
        } else { dialogRef.current?.close(); }
        scaleToFit(dialogRef.current);
    }, [actionState]);

    return (
        <dialog ref={dialogRef} className="entry-anim" onClose={() => setActionState(null)}>
            <div className="flex flex-col gap-4">
                <div className="w-full scrollBox flex gap-8">
                    <button onClick={() => setActionState(null)} className="icon-close" aria-label="Close"></button>
                    <button onClick={() => setActionState(null)} className="icon-save" aria-label="Close"></button>
                </div>
                <input placeholder="Title.." className="bg-inputB p-2 rounded-md" required maxLength={80} />
                <textarea className="scrollBox h-[60vh] bg-inputB p-2 rounded-md" />
            </div>
        </dialog>
    )
}

export default NotepadDialog;
