import { configureStore } from '@reduxjs/toolkit'
import team1Reducer from './team1'
import team2Reducer from './team2'
import logReducer from './logs'
import mapPointsReducer from './mapPoints'
import gameOptionsReducer from './gameOptions'
import playersReducer from './players'
import tournamentsReducer from './tournaments'
import gameInfoReducer from './gameInfo'

export const store = configureStore({
  reducer: {
    team1: team1Reducer,
    team2: team2Reducer,
    log: logReducer,
    mapPoints: mapPointsReducer,
    gameOptions: gameOptionsReducer,
    players: playersReducer,
    tournaments: tournamentsReducer,
    gameInfo: gameInfoReducer,
  },
})
