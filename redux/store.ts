import { configureStore } from '@reduxjs/toolkit'
import team1Reducer from './team1'
import team2Reducer from './team2'
import logReducer from './logs'

export const store = configureStore({
  reducer: {
    team1: team1Reducer,
    team2: team2Reducer,
    log: logReducer,
  },
})
