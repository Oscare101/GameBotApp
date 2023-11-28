import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameInfo } from '../constants/interfaces'

const initialState: GameInfo = {
  team: 'NOVA',
  expences: 0,
}

const gameInfoSlice = createSlice({
  name: 'gameInfo',
  initialState,
  reducers: {
    updateGameInfo: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { updateGameInfo } = gameInfoSlice.actions
export default gameInfoSlice.reducer
