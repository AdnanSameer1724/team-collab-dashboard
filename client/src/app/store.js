import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import tasksReducer from '../features/tasks/tasksSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer
  }
});