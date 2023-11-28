import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { StatusBar, Text, TouchableOpacity, View } from 'react-native'
import playersDefault from '../constants/playersDefault'
import { useDispatch, useSelector } from 'react-redux'
import { updatePlayers } from '../redux/players'
import tournamentsDefault from '../constants/tournamentsDefault'
import { updateTournaments } from '../redux/tournaments'
import { RootState } from '../redux'
import { updateGameInfo } from '../redux/gameInfo'
import gameInfoDefault from '../constants/gameInfoDefault'

export default function LaunchScreen({ navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  const dispatch = useDispatch()
  async function GetData() {
    const playersStorage = await AsyncStorage.getItem('players')
    if (playersStorage !== null) {
      dispatch(updatePlayers(JSON.parse(playersStorage)))
    } else {
      await AsyncStorage.setItem('players', JSON.stringify(playersDefault))
      dispatch(updatePlayers(playersDefault))
    }

    const gameInfoStorage = await AsyncStorage.getItem('gameInfo')
    if (gameInfoStorage !== null) {
      dispatch(updateGameInfo(JSON.parse(gameInfoStorage)))
    } else {
      await AsyncStorage.setItem('gameInfo', JSON.stringify(gameInfoDefault))
      dispatch(updateGameInfo(gameInfoDefault))
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
  }

  useEffect(() => {
    if (players.length && tournaments.length) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NavigationApp' }],
      })
    }
  }, [players, tournaments])

  useEffect(() => {
    GetData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />
      <Text>Loading</Text>
      {players.length > 0 && tournaments.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'NavigationApp' }],
            })
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: '#9dbef2',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 28, color: '#fff' }}>Start The Game</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  )
}
