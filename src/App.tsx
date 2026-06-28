import { useEffect, useRef, useState, type InputEvent, type UIEvent } from "react";
import { BrowserRouter, } from "react-router-dom";
import TodoPanel from "./main-panels/TodoPanel";
import ActivePanel from "./main-panels/ActivePanel";
import CompletedPanel from "./main-panels/CompletedPanel";
import FooterButton from "./footer-components/footer-button";
import { type ActiveTask, type CompletedTask, type Task, type TodoTask } from "./state";
import TaskCreationDialog from "./components/TaskCreationDialog";
import DisplayTaskDialog from "./components/TaskDisplayDialog";
import Fuse from "fuse.js";
import ToolsPanel from "./main-panels/tools-panel/ToolsPanel";

function Header(
    { panelIdx, setTasks, searchTasks }:
        {
            panelIdx: number,
            setTasks: React.Dispatch<React.SetStateAction<Task[][]>>,
            searchTasks: (_: InputEvent<HTMLInputElement>) => void,
        }
) {
    const buttonIconURLS = [
        'url(./src/assets/add-todo-task.svg)',
        'url(./src/assets/add-active-task.svg)'
    ];
    const [actionState, setActionState] = useState<'task creation' | 'search-mode' | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (actionState === 'search-mode') searchInputRef.current?.focus();
    }, [actionState]);

    return (
        <header id='app-header'>
            <TaskCreationDialog setTasks={setTasks} panelIdx={panelIdx} actionState={actionState} setActionState={setActionState} />
            <div className={"app-header-heading-wrapper" + (actionState === 'search-mode' ? " search-mode" : "")}>
                <h1>Kinetic &gt;&gt;</h1>
                <input
                    ref={searchInputRef}
                    placeholder={"Search " + (panelIdx === 0 ? "Todo Tasks" : panelIdx === 1 ? "Active Tasks" : "Completed Tasks") + "..."}
                    onInput={searchTasks}
                />
            </div>
            <button
                onClick={() => { actionState !== 'search-mode' ? setActionState('search-mode') : setActionState(null) }}
                style={{ "--icon-url": "url(./src/assets/search.svg)" } as React.CSSProperties}
                className={actionState === 'search-mode' ? 'selected' : ''}
            />
            {panelIdx != 2
                &&
                <button style={{ "--icon-url": buttonIconURLS[panelIdx] } as React.CSSProperties}
                    onClick={() => setActionState('task creation')}
                />}
        </header>
    );
}

function Body({ tasks, setTasks, panelIdx, onScroll }:
    {
        tasks: Task[][],
        setTasks: React.Dispatch<React.SetStateAction<Task[][]>>,
        panelIdx: number,
        onScroll: (_: UIEvent<HTMLDivElement>) => void
    }) {
    const [display_task_idx, set_display_task_idx] = useState(-1);

    return (
        <main id='app-body' onScroll={onScroll}>
            <TodoPanel tasks={tasks[0] as TodoTask[]} setDisplayTaskIdx={set_display_task_idx} />
            <ActivePanel tasks={tasks[1] as ActiveTask[]} setDisplayTaskIdx={set_display_task_idx} />
            <CompletedPanel tasks={tasks[2] as CompletedTask[]} setDisplayTaskIdx={set_display_task_idx} />
            <ToolsPanel />
            <DisplayTaskDialog
                taskIdx={display_task_idx}
                setTaskIdx={set_display_task_idx}
                setTasks={setTasks}
                panelIdx={panelIdx}
                tasks={tasks}
            />
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
            <FooterButton active={panelIdx == 3} name='Tools' icon='./src/assets/tools.svg' onClick={(_ev) => {
                setPanelIdx(3);
            }} />
        </footer>
    );
}

function APP() {
    const [panelIdx, setPanelIdx] = useState(0); // Panel index: 0,1,2 -> todo, active, completed panels

    // Get the exsiting tasks posted by the user
    let existing_data;
    try { existing_data = window.localStorage.getItem('kinetic') } catch (err) { console.warn(`Err ${err} while reading tasks`) };
    const existing_tasks = existing_data ? JSON.parse(existing_data) : [[], [], []];

    const [tasks, setTasks] = useState<Task[][]>(existing_tasks); // (panel -> tasks)

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
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    function filterTasks(ev: InputEvent<HTMLInputElement>) { // Side note: Use ChangeEvent for React input elements
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const query = ev.currentTarget.value.trim();

        searchTimeoutRef.current = setTimeout(() => {
            const currentPanelTasks = tasks[panelIdx];

            if (!query) {
                const resetTasks = currentPanelTasks.map(task => ({ ...task, visible: true }));
                setTasks(tasks.with(panelIdx, resetTasks));
                return;
            }
            const fuse = new Fuse(currentPanelTasks, { keys: ['name'], threshold: 0.4 });
            const filtered_tasks = fuse.search(query);
            const matchedIndices = new Set(filtered_tasks.map(result => result.refIndex));
            const updatedTasks = currentPanelTasks.map((task, index) => ({
                ...task,
                visible: matchedIndices.has(index)
            }));
            setTasks(tasks.with(panelIdx, updatedTasks));
        }, 600);
    }

    return (
        <>
            <BrowserRouter>
            </BrowserRouter>
            <Header panelIdx={panelIdx} setTasks={setTasks} searchTasks={filterTasks} />
            <Body tasks={tasks} panelIdx={panelIdx} setTasks={setTasks} onScroll={handleMainPanelScroll} />
            <Footer panelIdx={panelIdx} setPanelIdx={setPanelIdx} />
        </>
    );
}

export default APP;
