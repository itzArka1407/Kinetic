// Different buttons placed in the footer performing different Operations

import type { MouseEventHandler } from "react";

function FooterButton({ name, onClick, icon, active }: { name: string, onClick: MouseEventHandler<HTMLButtonElement>, icon: string, active: boolean }) {
    return (
        <button onClick={onClick} className={active ? 'selected' : undefined} style={{
            "--icon-url": `url(${icon})`
        } as React.CSSProperties}> {name}</button >
    );
}

export default FooterButton;
