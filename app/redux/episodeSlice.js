import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const episodeSlice = createSlice({
  name: "episode",
  initialState,
  reducers: {
    setEpisode: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEpisode } = episodeSlice.actions;

export default episodeSlice.reducer;
