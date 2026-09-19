import CalculatorDialog from "../components/CalculatorDialog";
import type { ActionState } from "../stores/state_types";

function ToolsPanel({ actionState, setActionState }: {
    actionState: ActionState,
    setActionState: React.Dispatch<React.SetStateAction<ActionState>>,
}) {
    return (
        <div className="tools-container">
            <CalculatorDialog actionState={actionState} setActionState={setActionState} />
            <button
                className="icon-calculator"
                onClick={() => setActionState('calculator')}
            >Calculator</button>
            <button
                className="icon-notepad"
                onClick={() => setActionState('calculator')}
            >Notepad</button>
        </div>
    );
}

export default ToolsPanel;
