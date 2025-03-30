import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthConfig = (getState) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/tasks', getAuthConfig(getState));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/tasks', taskData, getAuthConfig(getState));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, updates }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `/api/tasks/${taskId}`,
        updates,
        getAuthConfig(getState)
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, getAuthConfig(getState));
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastFetch: null,
  },
  reducers: {
    updateTaskStatus: (state, action) => {
      const task = state.items.find(t => t._id === action.payload.taskId);
      if (task) task.status = action.payload.newStatus;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task._id !== action.payload);
      })
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  }
});

export const { updateTaskStatus } = tasksSlice.actions;
export const selectAllTasks = (state) => state.tasks.items;
export const selectTaskById = (id) => (state) => 
  state.tasks.items.find(task => task._id === id);
export const selectTasksByStatus = (status) => (state) =>
  state.tasks.items.filter(task => task.status === status);
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;

export default tasksSlice.reducer;