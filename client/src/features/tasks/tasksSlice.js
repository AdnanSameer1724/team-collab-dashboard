import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    }
  }
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;