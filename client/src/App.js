import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser, logout } from './features/auth/authSlice';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { io } from "socket.io-client";
import api from './services/api';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch(logout());
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on("connect", () => {
        console.log('Connected to Socket.IO server');
      });

      newSocket.on("taskAdded", (task) => {
        console.log('New task received:', task);
        alert(`New task: ${task.title}`);
      });

      newSocket.on("connect_error", (err) => {
        console.error('Socket connection error:', err.message);
        if (err.message.includes('invalid token')) {
          dispatch(logout());
          localStorage.removeItem('token');
        }
      });

      newSocket.on("disconnect", () => {
        console.log('Disconnected from Socket.IO server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [dispatch, isAuthenticated]);

  if (useSelector((state) => state.auth.status === 'loading')) {
    return <div className='loading-screen'>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout socket={socket} />}>
            <Route path="/tasks" element={<TasksPage socket={socket} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute({ isAuthenticated, children }) {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/tasks" replace />;
}

export default App;