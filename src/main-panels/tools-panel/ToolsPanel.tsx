import CalculatorDialog from "../../components/CalculatorDialog";

function ToolsPanel({ actionState, setActionState }: {
    actionState: 'settings' | 'calculator' | 'task creation' | 'search-mode' | null,
    setActionState: React.Dispatch<React.SetStateAction<typeof actionState>>,
}) {
    return (
        <div className="tools-container">
            <CalculatorDialog actionState={actionState} setActionState={setActionState} />
            <button
                style={{ "--icon-url": "url(./src/assets/calculator.svg)" } as React.CSSProperties}
                onClick={() => setActionState('calculator')}
            >Calculator</button>
        </div>
    );
}

export default ToolsPanel;
