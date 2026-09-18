import { useEffect, useRef, useState } from "react";
import { scaleToFit } from "../stores/scale_fn";

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

    let [res_expr, res_setExpr] = useState<string>(''); // The expression displayed on the screen

    // To update the expression with the new operation
    function update_expr(ev: React.MouseEvent<HTMLButtonElement>) {
        const clickedBtn = ev.currentTarget;
        const disp = clickedBtn.style.getPropertyValue('disp-str') || clickedBtn.textContent || '';

        res_setExpr(prev => {
            if (clickedBtn.classList.contains('remv-opn')) {
                return prev.slice(0, -1);
            }
            return prev + disp;
        });

        console.log(res_expr);
    }

    const dialogRef = useRef<HTMLDialogElement | null>(null); // The ref to the dialog

    useEffect(() => {
        if (actionState !== "calculator") dialogRef.current?.close();
        else dialogRef.current?.showModal();

        scaleToFit(dialogRef.current); // Scale the dialog to fit the screen
    }, [actionState]);

    return (
        <dialog
            onClose={() => setActionState(null)}
            id="calculator-dialog"
            className="entry-anim scrollBox"
            ref={dialogRef}
        >
            <div className="calculator-screen-container">
                <button
                    style={{ "--icon-url": "url(./src/assets/minimize.svg)" } as React.CSSProperties}
                    className="closing-btn"
                    onClick={() => setActionState(null)}
                ></button>
                <button style={{ "--icon-url": "url(./src/assets/menu-button.svg)" } as React.CSSProperties}></button>
                <button style={{ "--icon-url": "url(./src/assets/equal.svg)" } as React.CSSProperties}></button>
            </div>
            <div className="top-container">
                {top_row_btn_urls.map(([url, label]) => {
                    return (
                        <button
                            key={url}
                            className={label === 'back' ? 'remv-opn' : undefined}
                            style={{ "--icon-url": url } as React.CSSProperties}
                            aria-label={label}
                            onClick={update_expr}
                        ></button>
                    );
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
