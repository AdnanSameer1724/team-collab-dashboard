import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, selectAllTasks, selectTasksStatus } from './tasksSlice';
import TaskItem from './TaskItem';

export default function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const status = useSelector(selectTasksStatus);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if(status === 'loading') return <div>Loading tasks...</div>

  return (
    <div className='task-list'>
        {tasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))}
    </div>
  );
}