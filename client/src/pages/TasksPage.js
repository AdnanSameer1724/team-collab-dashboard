import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/tasks/tasksSlice';
import TaskForm from '../features/tasks/TaskForm';
import TaskList from '../features/tasks/TaskList';
import { logout } from '../features/auth/authSlice';

export default function TasksPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, status } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="tasks-page">
      <header>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="tasks-container">
        <TaskForm />
        {status === 'loading' ? (
          <div>Loading tasks...</div>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>
    </div>
  );
}