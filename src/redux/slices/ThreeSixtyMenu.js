import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  props: {},
};
const threesixtySlice = createSlice({
  name: "threesixty",
  initialState,
  reducers: {
    setthreesixtySlicerProps: (state, action) => {
      state.props = action.payload;
    },
    clearthreesixtySlicerProps: (state) => {
      return initialState;
    },
  },
});

export const { setthreesixtySlicerProps, clearthreesixtySlicerProps } =
  threesixtySlice.actions;

export default threesixtySlice.reducer;
