import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { StatusBar, Text, View } from 'react-native'
import playersDefault from '../constants/playersDefault'
import { useDispatch } from 'react-redux'
import { updatePlayers } from '../redux/players'
import tournamentsDefault from '../constants/tournamentsDefault'
import { updateTournaments } from '../redux/tournaments'

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()
  async function GetData() {
    const playersStorage = await AsyncStorage.getItem('players')
    if (playersStorage !== null) {
      dispatch(updatePlayers(JSON.parse(playersStorage)))
    } else {
      await AsyncStorage.setItem('players', JSON.stringify(playersDefault))
      dispatch(updatePlayers(playersDefault))
    }

    const tournamentsStorage = await AsyncStorage.getItem('tournaments')
    if (tournamentsStorage !== null) {
      dispatch(updateTournaments(JSON.parse(tournamentsStorage)))
    } else {
      await AsyncStorage.setItem(
        'tournaments',
        JSON.stringify(tournamentsDefault)
      )
      dispatch(updateTournaments(tournamentsDefault))
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'NavigationApp' }],
    })
  }

  useEffect(() => {
    GetData()
  }, [])

  return (
    <View>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />
      <Text>Loading</Text>
    </View>
  )
}
