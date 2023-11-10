import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  MRNumber: 0,
  bestOf: 0,
  additionalRounds: 0,
}

const gameOprionsSlice = createSlice({
  name: 'gameOprions',
  initialState,
  reducers: {
    updateGameOptions: (state, action: PayloadAction<any>) => {
      state = action.payload
    },
  },
})

export const { updateGameOptions } = gameOprionsSlice.actions
export default gameOprionsSlice.reducer
