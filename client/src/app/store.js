import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from '../features/tasks/tasksSlice';
import authSlice from '../features/auth/authSlice'; 

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

export default store;