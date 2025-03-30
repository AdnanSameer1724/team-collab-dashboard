import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

export default function LoginPage() {
    const [ fomrData, setFormData ] = useState({
        email: '',
        password: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(fomrData));
        if(result.payload) navigate('/tasks');
    };
    
    return (
        <div className="auth-page">
            <h2>Login</h2>
            {error && <div className="alert error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email"
                        value={fomrData.email}
                        onChange={(e) => setFormData({ ...fomrData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        value={fomrData.password}
                        onChange={(e) => setFormData({ ...fomrData, password: e.target.value })}
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Logging in...' : 'Login' }
                </button>
            </form>
            <div className="auth-floor">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
    );
}