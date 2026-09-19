import { useEffect, useRef, useState } from "react";
import type { ActionState } from "../stores/state_types";
import { scaleToFit } from "../stores/scale_fn";
import { Preferences } from "@capacitor/preferences";

function NotepadDialog({ actionState, setActionState }: { actionState: ActionState, setActionState: React.Dispatch<React.SetStateAction<ActionState>> }) {
    const [title, setTitle] = useState(''); // The title of the current note
    const [body, setBody] = useState(''); // The body of the current note
    const DB_NOTES_KEY = 'notes'; // The key to store to db 

    type Note = { title: string, body: string }; // A note written by the user
    const [notes, setNotes] = useState<Note[]>([]); // The notes already written by the user

    // Operation mode - list notes, view a note or edit it
    const [notepadAction, setNotepadAction] = useState<'list' | 'view' | 'edit'>('list');

    // To get the notes from the db
    async function loadNotes() {
        let { value } = await Preferences.get({ key: DB_NOTES_KEY });
        setNotes(value ? JSON.parse(value) : []); // Load the notes from the db
    }
    useEffect(() => {
        loadNotes() // Initial load to display the notes in the list panel
        Preferences.remove({ key: DB_NOTES_KEY }); // #testing -- wiping out the notes -- REMOVE in prod
    }, []);

    // To save a note to the db
    async function saveNote() {
        if (title.length < 1) return;
        const new_note: Note = { title, body };
        const updated = [...notes, new_note];   // compute new array from current state

        // Refreshing the states before writing onto the db
        setNotes(updated);
        setNotepadAction('view');
        setTitle('');
        setBody('');
        await Preferences.set({
            key: DB_NOTES_KEY,
            value: JSON.stringify(updated),
        });
    }

    useEffect(() => console.log(notes), [notepadAction]); // #testing

    // Refreshing the state of the component whenver the app action state changes
    useEffect(() => {
        if (actionState !== 'notepad') {
            setNotepadAction('list'); // Refresh to list view 
            setBody(''); // Clear out the typed body
            setTitle(''); // Clear out the typed title
        }
    }, [actionState]);

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
                    <button
                        onClick={() => {
                            if (notepadAction === 'edit') saveNote(); // From editing mode, save the note
                            else setNotepadAction('edit'); // Go to editing mode
                        }}
                        className={notepadAction === 'edit' ? 'icon-save' : 'icon-edit'} aria-label="Edit"
                    ></button>
                </div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title.." className="bg-inputB p-2 rounded-md"
                    required
                    maxLength={80}
                    readOnly={notepadAction !== 'edit'}
                />
                <textarea
                    readOnly={notepadAction !== 'edit'}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="scrollBox h-[60vh] bg-inputB p-2 rounded-md"
                />
            </div>
        </dialog>
    )
}

export default NotepadDialog;
