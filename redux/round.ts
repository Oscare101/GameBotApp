import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const roundSlice = createSlice({
  name: 'round',
  initialState: 0,
  reducers: {
    updateRound: (state) => {
      state = state + 1
    },
  },
})

export const { updateRound } = roundSlice.actions
export default roundSlice.reducer
