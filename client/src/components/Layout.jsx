import { Outlet } from "react-router-dom";
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="app-container">
            <Navbar />
            <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}