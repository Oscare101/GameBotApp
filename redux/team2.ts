import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Team } from '../constants/interfaces'

const initialState: Team = {
  team: {
    name: '',
    players: [{ nickName: '-', rating: 0 }],
  },
}

const team2Slice = createSlice({
  name: 'team2',
  initialState,
  reducers: {
    updateTeam2: (state, action: PayloadAction<Team['team']>) => {
      state.team = action.payload
    },
  },
})

export const { updateTeam2 } = team2Slice.actions
export default team2Slice.reducer
