import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Team } from '../constants/interfaces'

const initialState: Team = {
  team: {
    name: '',
    players: [{ nickName: '-', rating: 0 }],
  },
}

const team1Slice = createSlice({
  name: 'team1',
  initialState,
  reducers: {
    updateTeam1: (state, action: PayloadAction<Team['team']>) => {
      state.team = action.payload
    },
  },
})

export const { updateTeam1 } = team1Slice.actions
export default team1Slice.reducer
