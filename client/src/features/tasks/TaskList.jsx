import { useSelector } from 'react-redux';

export default function TaskList() {
  const tasks = useSelector(state => state.tasks);

  return (
    <div>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.text}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
}