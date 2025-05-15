import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer
  }
});

export default store;