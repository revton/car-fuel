import { NavLink } from 'react-router-dom';
import { useHealth } from '../../shared/context/HealthContext';
import './Sidebar.css';

const Icons = {
    Dashboard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    ),
    Car: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    ),
    Fuel: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 22v-8a2 2 0 0 1 2-2h2.5" />
            <path d="M6 10h.5a2 2 0 0 1 2 2v2" />
            <path d="M10 14h.5a2 2 0 0 1 2-2V6a2 2 0 0 0-2-2h-1" />
            <path d="M13 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M16 6h2" />
            <path d="M16 18h2" />
        </svg>
    )
};

export const Sidebar = () => {
    const { isOnline } = useHealth();

    const getLinkClass = (isActive: boolean, disabled: boolean) => {
        let classes = 'nav-item';
        if (isActive) classes += ' active';
        if (disabled) classes += ' disabled';
        return classes;
    };

    const handleDisabledClick = (e: React.MouseEvent) => {
        if (!isOnline) {
            e.preventDefault();
        }
    };

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-icon">⛽</div>
                <h1 className="logo-text">Car Fuel</h1>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive, false)}>
                            <Icons.Dashboard />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/vehicles"
                            className={({ isActive }) => getLinkClass(isActive, !isOnline)}
                            onClick={handleDisabledClick}
                        >
                            <Icons.Car />
                            <span>Vehicles</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/fuelings"
                            className={({ isActive }) => getLinkClass(isActive, !isOnline)}
                            onClick={handleDisabledClick}
                        >
                            <Icons.Fuel />
                            <span>Fuelings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">JD</div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-role">Driver</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
