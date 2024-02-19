import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const seasonPosterSlice = createSlice({
  name: "seasonPoster",
  initialState,
  reducers: {
    setSeasonPoster: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSeasonPoster } = seasonPosterSlice.actions;

export default seasonPosterSlice.reducer;
