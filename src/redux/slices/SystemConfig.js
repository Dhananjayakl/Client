import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  systemConfig: {},
};

const systemConfigSlice = createSlice({
  name: "systemConfig",
  initialState,
  reducers: {
    setSystemConfig: (state, action) => {
      state.systemConfig = action.payload[0] || {};
      console.log("Updated System Config:", state.systemConfig);
    },
  },
});

export const { setSystemConfig } = systemConfigSlice.actions;

export default systemConfigSlice.reducer;
