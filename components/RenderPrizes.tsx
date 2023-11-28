import { Dimensions, Text, View } from 'react-native'
import { GetTeams } from '../functions/functions'
import TeamBig from './TeamBig'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

const width = Dimensions.get('screen').width

export default function RenderBigPrizes({ item, tournament }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  function GetTeamsInPlaces() {
    let teamsArr: any = []
    if (tournament.grid) {
      for (let i = tournament.grid.length - 1; i >= 0; i--) {
        tournament.grid[i].forEach((pair: any) => {
          if (!teamsArr.includes(pair.winner)) {
            teamsArr.push(pair.winner)
          }
        })
      }
      GetTeams(players).forEach((team: any) => {
        if (!teamsArr.includes(team)) {
          teamsArr.push(team)
        }
      })
      return teamsArr
    } else {
      return []
    }
  }

  return (
    <View
      style={{
        backgroundColor: '#ddd',
        width: (width * 0.92) / 2 - width * 0.02,
        marginLeft: item.index % 2 == 1 ? width * 0.04 : 0,
        marginTop: width * 0.04,
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      <Text>
        {item.index === 0
          ? '1st'
          : item.index === 1
          ? '2nd'
          : item.index >= 2 && item.index <= 3
          ? '3-4th'
          : item.index >= 4 && item.index <= 7
          ? '5-8th'
          : item.index >= 8 && item.index <= 15
          ? '9-16th'
          : ''}
      </Text>
      {tournament.winner ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: '500' }}>
            {GetTeamsInPlaces()[item.index]}
          </Text>
          <View style={{ position: 'absolute', zIndex: -1, opacity: 0.1 }}>
            <TeamBig team={GetTeamsInPlaces()[item.index]} />
          </View>
        </>
      ) : (
        <></>
      )}
      <Text style={{ fontSize: 20 }}>
        {item.item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $
      </Text>
    </View>
  )
}
