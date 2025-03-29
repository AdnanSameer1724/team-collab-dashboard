import TaskForm from '../features/tasks/TaskForm';
import TaskList from '../features/tasks/TaskList';

export default function TasksPage() {
  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}