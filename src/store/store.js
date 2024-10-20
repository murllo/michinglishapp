import { configureStore } from "@reduxjs/toolkit";

import { dataSlice } from "./data/dataSlice"


export const store = configureStore({
    reducer: {
        data: dataSlice.reducer,
    }
})