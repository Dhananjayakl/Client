import { createSlice } from "@reduxjs/toolkit";

const ModalCloseHandler = createSlice({
  name: "ModalCloseHandler",
  initialState: { value: false },
  reducers: {
    ModalOnClick: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { ModalOnClick } = ModalCloseHandler.actions;
export default ModalCloseHandler.reducer;
