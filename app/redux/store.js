import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import episodeReducer from './episodeSlice'
import personReducer from './personSlice'
import seasonPosterReducer from './seasonPosterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    episode: episodeReducer,
    person: personReducer,
    seasonPoster: seasonPosterReducer,
  },
})