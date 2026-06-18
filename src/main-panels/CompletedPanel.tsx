// Panel to display completed tasks

import type React from "react";
import type { Task } from "../state";

function CompletedPanel({ tasks, setSelectedTask }: { tasks: Array<any>, setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>> }) {
    // TODO: Complete the complete panel design
    return (
        <div onClick={() => { }}
            className="task-container scrollBox completed-container"></div>
    );
}

export default CompletedPanel;
