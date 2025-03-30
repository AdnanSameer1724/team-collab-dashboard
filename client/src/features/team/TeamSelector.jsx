import { useSelector, useDispatch } from 'react-redux';
import { assignTaskToUser } from '../tasks/tasksSlice';

export default function TeamSelector({ taskId }) {
  const teamMembers = useSelector((state) => state.team.members);
  const dispatch = useDispatch();

  const handleAssign = (userId) => {
    dispatch(assignTaskToUser({ taskId, userId }));
  };

  return (
    <select onChange={(e) => handleAssign(e.target.value)}>
      <option value="">Unassigned</option>
      {teamMembers.map(user => (
        <option key={user._id} value={user._id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}