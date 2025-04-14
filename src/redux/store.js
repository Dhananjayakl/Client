// import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./slices/counter";
// import threesixtySlice from "./slices/ThreeSixtyMenu";
// import systemConfig from "./slices/SystemConfig";

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
//   reducer: {
//     threesixty: threesixtySlice,
//   },
//   reducer: {
//     systemConfig: systemConfig,
//   },
// });

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter";
import threesixtySlice from "./slices/ThreeSixtyMenu";
import systemConfig from "./slices/SystemConfig";
import MenuChange from "./slices/SselectDependency";
import ParentOnChange from "./slices/SselectOnChange";
import ModalCloseHandler from "./slices/ModalHandler";
import ChildValue from "./slices/RefreshedChildVal";
import uploadReducer from "./slices/ProfileImg";
import FormMetaDataStore from "./slices/MetaFetcher";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    threesixty: threesixtySlice,
    systemConfig: systemConfig,
    MenuChange: MenuChange,
    ParentOnChange: ParentOnChange,
    ChildValue: ChildValue,
    ModalCloseHandler: ModalCloseHandler,
    upload: uploadReducer,
    FormMetaDataStore: FormMetaDataStore,
  },
});
