import { configureStore } from "@reduxjs/toolkit";
import reducer from "../reducer/index";

const store = configureStore({
  reducer: reducer,
  // Redux Toolkit includes thunk middleware by default
  // DevTools are also enabled by default in development
});

export default store;
