import { useEffect, useRef, useState, type UIEvent } from "react";
import { BrowserRouter, } from "react-router-dom";
import TodoPanel from "./main-panels/TodoPanel";
import ActivePanel from "./main-panels/ActivePanel";
import CompletedPanel from "./main-panels/CompletedPanel";
import FooterButton from "./footer-components/footer-button";
import { type ActiveTask, type Task, type TodoTask } from "./state";
import TaskCreationDialog from "./components/TaskCreationDialog";
import DisplayTaskDialog from "./components/TaskDisplayDialog";

function Header({ panelIdx, setTasks }: { panelIdx: number, setTasks: React.Dispatch<React.SetStateAction<Task[][]>> }) {
    const buttonIconURLS = [
        'url(./src/assets/add-todo-task.svg)',
        'url(./src/assets/add-active-task.svg)'
    ];
    const [actionState, setActionState] = useState<'task creation' | null>(null);
    return (
        <header id='app-header'>
            <TaskCreationDialog setTasks={setTasks} panelIdx={panelIdx} actionState={actionState} setActionState={setActionState} />
            <h1>Kinetic &gt;&gt;</h1>
            {panelIdx != 2
                &&
                <button style={{ "--icon-url": buttonIconURLS[panelIdx] } as React.CSSProperties}
                    onClick={() => setActionState('task creation')}></button>}
        </header>
    );
}

function Body({ tasks, onScroll }: { tasks: Task[][], onScroll: (_: UIEvent<HTMLDivElement>) => void }) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <main id='app-body' onScroll={onScroll}>
            <TodoPanel tasks={tasks[0] as TodoTask[]} setSelectedTask={setSelectedTask} />
            <ActivePanel tasks={tasks[1] as ActiveTask[]} setSelectedTask={setSelectedTask} />
            <CompletedPanel tasks={tasks[2]} setSelectedTask={setSelectedTask} />
            <DisplayTaskDialog display_task={selectedTask} setDisplayTask={setSelectedTask} />
        </main>
    );
}

function Footer({ panelIdx, setPanelIdx }: { panelIdx: number, setPanelIdx: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <footer id='app-footer'>
            <FooterButton active={panelIdx == 0} name='Todo' icon='./src/assets/todo.svg' onClick={(_ev) => {
                setPanelIdx(0);
            }} />
            <FooterButton active={panelIdx == 1} name='Active' icon='./src/assets/active.svg' onClick={(_ev) => {
                setPanelIdx(1);
            }} />
            <FooterButton active={panelIdx == 2} name='Completed' icon='./src/assets/completed.svg' onClick={(_ev) => {
                setPanelIdx(2);
            }} />
        </footer>
    );
}

function APP() {
    const [panelIdx, setPanelIdx] = useState(0); // Panel index: 0,1,2 -> todo, active, completed panels
    const [tasks, setTasks] = useState<Task[][]>([[], [], []]); // (panel -> tasks)
    const isBodyAutoScrolling = useRef(false); // If scrolling in app's body is made about automatically(by buttons for example)
    const bodyScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // The timeout to determine when the locking on auto-scrolling would occur

    // When the panel index changes, bring the appropriate panel into view
    useEffect(() => {
        const body = document.getElementById('app-body');
        isBodyAutoScrolling.current = true; // Mark true -- manual scrolls will be locked
        body?.scrollTo({ left: panelIdx * body.clientWidth, behavior: "smooth" });

        if (bodyScrollTimeoutRef.current) clearTimeout(bodyScrollTimeoutRef.current);
        bodyScrollTimeoutRef.current = setTimeout(() => isBodyAutoScrolling.current = false, 400); // 400ms -- browser's natural scroll duration
    }, [panelIdx]);

    const handleMainPanelScroll = (ev: UIEvent<HTMLDivElement>) => {
        if (isBodyAutoScrolling.current) return; // No operations when an auto scrolling is happening
        const container = ev.currentTarget;
        const exactIdx = container.scrollLeft / container.clientWidth; // Check if a complete scroll is done
        const currentTabIdx = Math.round(exactIdx);

        // If panel is changed -- perform state changes
        if (currentTabIdx !== panelIdx)
            setPanelIdx(currentTabIdx);
    }

    return (
        <>
            <BrowserRouter>
            </BrowserRouter>
            <Header panelIdx={panelIdx} setTasks={setTasks} />
            <Body tasks={tasks} onScroll={handleMainPanelScroll} />
            <Footer panelIdx={panelIdx} setPanelIdx={setPanelIdx} />
        </>
    );
}

export default APP;
