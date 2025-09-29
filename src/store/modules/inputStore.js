import { createSlice } from "@reduxjs/toolkit";

import defaultText from "public/assets/defaultText";

const inputStore = createSlice({
  name: "input",
  initialState: {
    value: localStorage.getItem("markdown-content") || defaultText,
  },
  reducers: {
    updateInput: (state, action) => {
      state.value = action.payload;
    },
  },
});

const { updateInput } = inputStore.actions;

const inputReducer = inputStore.reducer;

export { updateInput };

export default inputReducer;
