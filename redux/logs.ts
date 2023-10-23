import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Log } from '../constants/interfaces'

const initialState: Log[] = []

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    updateLog: (state, action: PayloadAction<Log>) => {
      state.push(action.payload)
    },
    clearLog: (state) => {
      state.splice(0, state.length) // Очищаємо масив, видаляючи всі елементи
    },
  },
})

export const { updateLog, clearLog } = logSlice.actions
export default logSlice.reducer
