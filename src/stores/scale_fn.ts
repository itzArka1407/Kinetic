// To scale a component based on its dimensions to make it fit to the screen

export function scaleToFit(node: HTMLElement | null) {
    if (node) {
        // Leaving out some gap to prevent it from sticking to the screen
        const gap = 30;
        const windowHeight = window.innerHeight - gap;
        const windowWidth = window.innerWidth - gap;

        const nodeHt = node.clientHeight;
        const nodeWt = node.clientWidth;

        const scaleX = windowWidth / nodeWt;
        const scaleY = windowHeight / nodeHt;

        node.style.setProperty('--scale', `${Math.min(scaleX, scaleY)}`);
    }
}
