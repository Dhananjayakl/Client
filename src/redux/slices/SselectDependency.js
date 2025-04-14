import { createSlice } from "@reduxjs/toolkit";

const MenuChange = createSlice({
  name: "MenuChange",
  initialState: { value: false },
  reducers: {
    MenuOnChange: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { MenuOnChange } = MenuChange.actions;
export default MenuChange.reducer;
