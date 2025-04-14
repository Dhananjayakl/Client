import { createSlice } from "@reduxjs/toolkit";

const ParentOnChange = createSlice({
  name: "ParentOnChange",
  initialState: { value: false },
  reducers: {
    ParentFieldOnChange: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { ParentFieldOnChange } = ParentOnChange.actions;
export default ParentOnChange.reducer;
