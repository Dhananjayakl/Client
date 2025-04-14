import { createSlice } from "@reduxjs/toolkit";

const ChildValue = createSlice({
  name: "ChildValue",
  initialState: { value: "" },
  reducers: {
    RefreshedChildValue: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { RefreshedChildValue } = ChildValue.actions;
export default ChildValue.reducer;
