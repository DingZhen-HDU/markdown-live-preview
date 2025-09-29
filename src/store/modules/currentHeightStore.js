import { createSlice } from "@reduxjs/toolkit";

const currentHeightStore = createSlice({
  name: "currentHeight",
  initialState: {
    isActive: true,
    value: 0,
  },
  reducers: {
    updateCurrentHeight: (state, action) => {
      state.currentHeight = action.payload;
    },
    updateSyncScrollIsActive: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

const { updateCurrentHeight, updateSyncScrollIsActive } =
  currentHeightStore.actions;

const currentHeightReducer = currentHeightStore.reducer;

export { updateCurrentHeight, updateSyncScrollIsActive };

export default currentHeightReducer;
