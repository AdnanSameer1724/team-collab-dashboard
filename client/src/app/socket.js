import io from 'socket.io-client';
import { store } from './store';
import { updateTask, deleteTask } from '../features/tasks/tasksSlice';

const socket = io('http://localhost:5000', {
    autoConnect: false
});

export const connectSocket = (token) => {
    socket.io.opts.query = { token };
    socket.connect();

    socket.on('taskUpdated', (task) => {
        store.dispatch(updateTask.fulfilled(task));
    });

    socket.on('taskDeleted', (taskId) => {
        store.dispatch(deleteTask.fulfilled(taskId));
    });

    return socket;
};

export default socket;