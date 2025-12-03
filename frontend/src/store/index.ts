import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./employeeSlice";
import shiftReducer from "./shiftSlice";
import userReducer from "./userSlice";
import departmentReducer from "./departmentSlice";
import sidebarReducer from "./sidebarSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    shifts: shiftReducer,
    employees: employeeReducer,
    departments: departmentReducer,
    sidebar:sidebarReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
