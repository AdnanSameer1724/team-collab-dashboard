import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from './tasksSlice';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTask({ title }));
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="New task..."
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
}