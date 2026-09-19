// Different buttons placed in the footer performing different Operations

import type { MouseEventHandler } from "react";

function FooterButton({ name, onClick, classes, active }: { name: string, onClick: MouseEventHandler<HTMLButtonElement>, classes: string, active: boolean }) {
    return (
        <button onClick={onClick} className={active ? `selected ${classes}` : `${classes}`} >{name}</button >
    );
}

export default FooterButton;
