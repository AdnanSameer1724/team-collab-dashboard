import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "./tasksSlice";

export default function TaskItem({ task }) {
    const { isEditing, setIsEditing } = useState(false);
    const { editedTitle, setEditedTitle } = useState(task.title);
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus) => {
        dispatch(updateTask({ taskId: task._id, updates: { status: newStatus }}));
    };

    const handleSave = () => {
        dispatch(updateTask({
            taskId: task._id,
            updates: { title: editedTitle }
        }));
        setIsEditing(false);
    };

    return (
        <div className={`task-card ${task.status}`}>
            {isEditing ? (
                <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSave}
                    autoFocus
                />
            ) : (
                <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
            )}
            <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
            >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <button onClick={() => dispatch(deleteTask(task._id))}>Delete</button>
        </div>
    );
}