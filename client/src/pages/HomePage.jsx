import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="home-page">
            <h1>Welcome to Team Collab</h1>
            <p>Manage your team's tasks efficiently</p>
            <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">
                    Get Started
                </Link>
                <br />
                <Link to="/login" className="btn btn-secondary">
                    Login
                </Link>
            </div>
        </div>
    );
}