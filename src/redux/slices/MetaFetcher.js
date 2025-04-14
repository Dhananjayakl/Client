import { createSlice } from "@reduxjs/toolkit";
const FormMetaDataStore = createSlice({
  name: "formMeta",
  initialState: {
    value: {
      dependencyFields: [],
      util: "",
      fields: "",
    },
  },
  reducers: {
    fetchMeta: (state, action) => {
      console.log(action, "actiosn are here");

      state.value = action.payload;
    },
    setUtils: (state, action) => {
      state.value.util = action.payload;
    },
    setDependencyFields: (state, action) => {
      state.value.dependencyFields = action.payload;
    },
  },
});
export const { fetchMeta, setDependencyFields, setUtils } =
  FormMetaDataStore.actions;
export default FormMetaDataStore.reducer;
