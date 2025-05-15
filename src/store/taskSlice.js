import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  currentTask: null
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    resetTaskState: () => initialState
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  setCurrentTask,
  clearCurrentTask,
  resetTaskState
} = taskSlice.actions;
export default taskSlice.reducer;