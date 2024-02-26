import { configureStore } from '@reduxjs/toolkit'
import episodeReducer from './episodeSlice'
import personReducer from './personSlice'
import seasonPosterReducer from './seasonPosterSlice'

export const store = configureStore({
  reducer: {
    episode: episodeReducer,
    person: personReducer,
    seasonPoster: seasonPosterReducer,
  },
})