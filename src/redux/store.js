import { configureStore } from '@reduxjs/toolkit'
import episodeReducer from './slices/episodeSlice'
import personReducer from './slices/personSlice'
import seasonPosterReducer from './slices/seasonPosterSlice'

export const store = configureStore({
  reducer: {
    episode: episodeReducer,
    person: personReducer,
    seasonPoster: seasonPosterReducer,
  },
})