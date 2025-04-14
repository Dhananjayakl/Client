import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadSuccess: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setUploadSuccess: (state, action) => {
      state.uploadSuccess = action.payload;
    },
  },
});

export const { setUploadSuccess } = uploadSlice.actions;
export default uploadSlice.reducer;
