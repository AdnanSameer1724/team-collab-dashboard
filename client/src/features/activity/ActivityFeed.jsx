import { useSelector } from 'react-redux';

export default function ActivityFeed() {
  const activities = useSelector((state) => state.activity.items);

  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            <strong>{activity.user.name}</strong> {activity.action}
          </li>
        ))}
      </ul>
    </div>
  );
}