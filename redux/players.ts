import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Player } from '../constants/interfaces'

const initialState: Player[] = []

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    updatePlayers: (state, action: PayloadAction<Player[]>) => {
      state.splice(0, state.length, ...action.payload)
    },
  },
})

export const { updatePlayers } = playersSlice.actions
export default playersSlice.reducer
