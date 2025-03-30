import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="navbar">
            <Link to="/" className="logo">TeamCollab</Link>
            <nav>
                {user ? (
                    <>
                        <span>Welcome, { user.name }</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}