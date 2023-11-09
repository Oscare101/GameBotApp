import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

const mapPointSlice = createSlice({
  name: 'mapPoints',
  initialState,
  reducers: {
    updateMapPoints: (state, action: PayloadAction<string>) => {
      state.push(action.payload)
    },
    clearMapPoints: (state) => {
      state.splice(0, state.length) // Очищаємо масив, видаляючи всі елементи
    },
  },
})

export const { updateMapPoints, clearMapPoints } = mapPointSlice.actions
export default mapPointSlice.reducer
