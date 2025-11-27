import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

export const MainLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
