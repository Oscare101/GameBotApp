import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GetSortedPlayersByRating } from '../functions/functions'

export default function PlayerStatSegments(props: any) {
  const players = useSelector((state: RootState) => state.players)

  const playerStatPercent =
    (100 *
      (players.length -
        GetSortedPlayersByRating(players).findIndex(
          (i: any) => i.rating === props.rating
        ))) /
    players.length

  return (
    <View
      style={{
        height: 10,
        width: 110,
        backgroundColor: '#eee',
        flexDirection: 'row',
        marginVertical: 10,
      }}
    >
      <View
        style={{
          height: '100%',
          width: '33.33%',
          backgroundColor: '#d94848',
          opacity: playerStatPercent > 33.33 ? 0.3 : 1,
        }}
      />
      <View
        style={{
          height: '100%',
          width: '33.33%',
          backgroundColor: '#e8e05f',
          opacity:
            playerStatPercent >= 33.33 && playerStatPercent <= 66.66 ? 1 : 0.3,
        }}
      />
      <View
        style={{
          height: '100%',
          width: '33.33%',
          backgroundColor: '#45c454',
          opacity: playerStatPercent > 66.66 ? 1 : 0.3,
        }}
      />
      <View
        style={{
          height: 30,
          width: 10,
          top: -10,
          // TODO FIX THIS SHIT
          left: playerStatPercent,
          backgroundColor: '#00000066',
          position: 'absolute',
        }}
      />
    </View>
  )
}
