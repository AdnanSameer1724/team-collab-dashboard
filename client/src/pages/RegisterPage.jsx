import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/auth/authSlice';

export default function RegisterPage() {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }
        const result = await dispatch(registerUser(formData));
        if (result.payload) navigate('/tasks');
    };

    return (
        <div className="auth-page">
            <h2>Register</h2>
            {error && <div className="alert error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                </div>
                <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                </div>
                <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="6"
                />
                </div>
                <div className="form-group">
                <label>Confirm Password</label>
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                />
                </div>
                <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Registering...' : 'Register'}
                </button>
            </form>
            <div className="auth-footer">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}