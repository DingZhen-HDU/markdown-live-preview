import { configureStore } from "@reduxjs/toolkit";

import inputReducer from "./modules/inputStore";
import currentHeightReducer from "./modules/currentHeightStore";

const store = configureStore({
  reducer: {
    input: inputReducer,
    currentHeight: currentHeightReducer,
  },
});

export default store;
