import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPerson: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPerson } = personSlice.actions;

export default personSlice.reducer;
