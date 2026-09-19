import { useEffect, useRef, useState } from "react";
import { scaleToFit } from "../stores/scale_fn";

function CalculatorDialog({ actionState, setActionState }:
    {
        actionState: 'settings' | 'calculator' | 'search-mode' | 'task creation' | null,
        setActionState: React.Dispatch<React.SetStateAction<typeof actionState>>,
    }) {
    // The buttons that are placed inside the calculator
    const top_row_btn_urls = [
        ['icon-up-arrow', 'exponent'],
        ['icon-pi', 'pi'],
        ['icon-backspace', 'back'],
    ];
    const numbers_panel_btns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'e'];
    const right_col_btn_urls = [
        ['icon-percent', 'remainder'],
        ['icon-close', 'multiply'],
        ['icon-division', 'divide'],
        ['icon-add', 'add'],
        ['icon-subtract', 'subtract'],
    ];

    interface DisplayToken {
        value: string, // The value of the token
        kind: 'icon' | 'text', // If it is a text token or a icon token 
    }

    let [res_tokens, res_setTokens] = useState<DisplayToken[]>([]); // The expression displayed on the screen

    // To update the expression with the new operation
    function update_expr(ev: React.MouseEvent<HTMLButtonElement>) {
        const clickedBtn = ev.currentTarget;

        res_setTokens(prev => {
            console.log(prev); // #testing
            if (clickedBtn.classList.contains('remv-opn') && prev.length > 0) {
                return prev.slice(0, -1);
            }

            const iconText = clickedBtn.style.getPropertyValue('--icon-url'); // Check the icon text(if exists)
            const disp: DisplayToken = iconText.length === 0 ?
                { value: clickedBtn.textContent || '', kind: 'text' } : // No icon class - render the textcontent
                { value: clickedBtn.style.getPropertyValue('--icon-url'), kind: 'icon' };
            return [...prev, disp];
        });
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
            <div className="calculator-screen-container" >
                <div className="rendering-screen">
                    <div>{res_tokens.map(t => {
                        return t.kind === 'text' ?
                            <span>{t.value}</span> :
                            <span style={{ "--icon-url": t.value } as React.CSSProperties}></span>
                    })}</div>
                </div>
                <button
                    className="closing-btn icon-minimize"
                    onClick={() => setActionState(null)}
                ></button>
                <button className="icon-menu"></button>
                <button className="icon-equal"></button>
            </div>
            <div className="top-container">
                {top_row_btn_urls.map(([icon, label]) => {
                    return (
                        <button
                            className={`${label === 'back' ? 'remv-opn' : ''} ${icon}`}
                            aria-label={label}
                            onClick={update_expr}
                        ></button>
                    );
                })}
            </div>
            <div className="num-container">
                {numbers_panel_btns.map(text => {
                    return (<button onClick={update_expr}>{text}</button>)
                })}
            </div>
            <div className="right-container">
                {right_col_btn_urls.map(([icon, label]) => {
                    return (<button onClick={update_expr} className={icon} aria-label={label}></button>)
                })}
            </div>
        </dialog >
    );
}

export default CalculatorDialog;
