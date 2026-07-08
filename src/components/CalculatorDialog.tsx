import { useEffect, useRef, useState } from "react";

function CalculatorDialog({ actionState, setActionState }:
    {
        actionState: 'settings' | 'calculator' | 'search-mode' | 'task creation' | null,
        setActionState: React.Dispatch<React.SetStateAction<typeof actionState>>,
    }) {
    // The buttons that are placed inside the calculator
    const top_row_btn_urls = [
        ['url(./src/assets/up-arrow.svg)', 'exponent'],
        ['url(./src/assets/pi.svg)', 'pi'],
        ['url(./src/assets/backspace.svg)', 'back'],
    ];
    const numbers_panel_btns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'e'];
    const right_col_btn_urls = [
        ['url(./src/assets/percent.svg)', 'remainder'],
        ['url(./src/assets/close.svg)', 'multiply'],
        ['url(./src/assets/division.svg)', 'divide'],
        ['url(./src/assets/add.svg)', 'add'],
        ['url(./src/assets/subtract.svg)', 'subtract'],
    ];

    let [calcRes, setCalcRes] = useState<string>(''); // The result that is displayed
    const dialogRef = useRef<HTMLDialogElement | null>(null); // The ref to the dialog

    useEffect(() => {
        if (actionState !== "calculator") dialogRef.current?.close();
        else dialogRef.current?.showModal();
    }, [actionState]);

    return (
        <dialog
            id="calculator-dialog"
            className="entry-anim scrollBox"
            ref={dialogRef}
        >
            <div className="calculator-screen-container">
                <button
                    style={{ "--icon-url": "url(./src/assets/equal.svg)" } as React.CSSProperties}
                    className="closing-btn"
                    onClick={() => setActionState(null)}
                ></button>
                <button style={{ "--icon-url": "url(./src/assets/equal.svg)" } as React.CSSProperties}></button>
                <button style={{ "--icon-url": "url(./src/assets/equal.svg)" } as React.CSSProperties}></button>
            </div>
            <div className="top-container">
                {top_row_btn_urls.map(([url, label]) => {
                    return (<button style={{ "--icon-url": url } as React.CSSProperties} aria-label={label}></button>)
                })}
            </div>
            <div className="num-container">
                {numbers_panel_btns.map(text => {
                    return (<button>{text}</button>)
                })}
            </div>
            <div className="right-container">
                {right_col_btn_urls.map(([url, label]) => {
                    return (<button style={{ "--icon-url": url } as React.CSSProperties} aria-label={label}></button>)
                })}
            </div>
        </dialog>
    );
}

export default CalculatorDialog;
