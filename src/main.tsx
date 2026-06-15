import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./App.css";
import App from './App.tsx'
import FooterButton from './footer-components/footer-button.tsx';
import TodoPanel from './main-panels/TodoPanel.tsx';
import ActivePanel from './main-panels/ActivePanel.tsx';
import CompletedPanel from './main-panels/CompletedPanel.tsx';

function Header() {
    return (
        <div id='app-header'>Kinetic &gt;&gt;</div>
    );
}

const [panelIdx, setPanelIdx] = useState(0);
const [tasks, setTasks] = useState([]); // (panel -> tasks)

function Body() {
    // Todo tasks, active tasks, completed tasks
    return (
        <main id='app-body'>
            <TodoPanel tasks={tasks[0]} />
            <ActivePanel tasks={tasks[1]} />
            <CompletedPanel tasks={tasks[2]} />
        </main>
    );
}

function Footer() {
    return (
        <footer id='app-footer'>
            <FooterButton active={panelIdx == 0} name='Todo Tasks' icon='./src/assets/todo.svg' onClick={(_ev) => {
                document.getElementById('app-body')?.children[0].scrollIntoView({ behavior: 'smooth' });
                setPanelIdx(0);
            }} />
            <FooterButton active={panelIdx == 1} name='Active Tasks' icon='./src/assets/active.svg' onClick={(_ev) => {
                document.getElementById('app-body')?.children[1].scrollIntoView({ behavior: 'smooth' });
                setPanelIdx(1);
            }} />
            <FooterButton active={panelIdx == 2} name='Completed Tasks' icon='./src/assets/completed.svg' onClick={(_ev) => {
                document.getElementById('app-body')?.children[2].scrollIntoView({ behavior: 'smooth' });
                setPanelIdx(2);
            }} />
        </footer>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Header />
        <Body />
        <Footer />
    </StrictMode>
)
