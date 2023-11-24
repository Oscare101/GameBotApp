import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import playersDefault from '../constants/playersDefault'
import { useDispatch } from 'react-redux'
import { updatePlayers } from '../redux/players'

export default function LaunchScreen({ navigation }: any) {
  const dispatch = useDispatch()
  async function GetData() {
    const playersStorage = await AsyncStorage.getItem('players')
    if (playersStorage !== null) {
      console.log('not null')
      dispatch(updatePlayers(JSON.parse(playersStorage)))
    } else {
      console.log('null')
      await AsyncStorage.setItem('players', JSON.stringify(playersDefault))
      dispatch(updatePlayers(playersDefault))
    }
    navigation.navigate('NavigationApp')
  }

  useEffect(() => {
    GetData()
  }, [])

  return (
    <View>
      <Text>Loading</Text>
    </View>
  )
}
