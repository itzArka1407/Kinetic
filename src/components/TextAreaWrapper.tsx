import { useEffect, useState, type InputEvent } from "react";

function TextAreaWrapper(
    { defaultValue = undefined }:
        // Action state represents the state of action, sometimes, the default value is constant, so the action state is needed for reactivity
        { defaultValue?: string | undefined }
) {
    const [len, setLen] = useState(defaultValue?.length || 0);
    // Everytime the default value is loaded, the length is set based on the default value
    useEffect(() => {
        setLen(defaultValue?.length || 0);
    }, [defaultValue]);

    return (<div className="textarea-wrapper" style={{ "--len": `"${len}"` } as React.CSSProperties}>
        <textarea
            name="task-desc"
            maxLength={500}
            placeholder="Description..."
            onInput={(ev: InputEvent<HTMLTextAreaElement>) => setLen(ev.currentTarget.value.length)}
            defaultValue={defaultValue}
        />
    </div>);
}

export default TextAreaWrapper;
