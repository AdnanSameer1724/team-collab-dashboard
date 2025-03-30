import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetch: null
};

const getAuthConfig = (getState) => ({
  headers: {
    Authorization: `Bearer ${getState().auth.token}`
  }
});

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
  initialState,
  reducers: {
    updateTaskStatus: (state, action) => {
      const task = state.items.find(t => t._id === action.payload.taskId);
      if (task) task.status = action.payload.newStatus;
    },
    addLocalTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    clearTasksError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle each case explicitly without matchers
    
    // Fetch Tasks
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
      });

    // Add Task
    builder
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Repeat similar pattern for updateTask and deleteTask...
  }
});

export const { updateTaskStatus, addLocalTask, clearTasksError } = tasksSlice.actions;

export const selectAllTasks = (state) => state.tasks.items;
export const selectTaskById = (id) => (state) => 
  state.tasks.items.find(task => task._id === id);
export const selectTasksByStatus = (status) => (state) =>
  state.tasks.items.filter(task => task.status === status);
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;
export const selectLastFetchTime = (state) => state.tasks.lastFetch;

export default tasksSlice.reducer;