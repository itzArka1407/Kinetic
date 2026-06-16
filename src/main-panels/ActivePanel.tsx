// Displaying panel for active tasks

import type { ActiveTask } from "../state";

function ActivePanel({ tasks }: { tasks: ActiveTask[] }) {
    return (
        <div className="scrollBox"></div>
    );
}

export default ActivePanel;
