import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { Tournament } from '../constants/interfaces'
import {
  GetTeamPoints,
  GetTeamPrizes,
  GetTeamWinRate,
  GetTeams,
} from '../functions/functions'
import Teams from '../components/Teams'

export default function YearlyRatingScreen({ navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)
  const teams = GetTeams(players)

  function GetDataBySeason() {
    const seasonsAmount: number = tournaments[tournaments.length - 1].season
    const sesons: any = []
    for (let i = 1; i <= seasonsAmount; i++) {
      const seasonTournaments = tournaments.filter(
        (t: Tournament) => t.season === i
      )
      sesons.push(seasonTournaments)
    }
    return sesons
  }

  function RenderTeamsItem({ item, tournaments }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: '#fff',
          marginVertical: 5,
          borderRadius: 5,
          padding: 5,
          overflow: 'hidden',
          paddingRight: 10,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PlayerInfoScreen', {
            player: players.filter((p: any) => p.team === item.item)[0],
          })
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
          }}
        >
          <Text style={styles.position}>{item.index + 1}</Text>

          <Teams team={item.item} />
          <Text style={styles.teamName}>{item.item}</Text>
        </View>
        <Text style={[styles.points]}>
          points {GetTeamPoints(tournaments, players, item.item)}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <View style={styles.rowStart}>
            <Text style={[styles.teamStatTitle]}>
              Prizes:{' '}
              {GetTeamPrizes(tournaments, players, item.item)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
              $
            </Text>
          </View>

          <View style={styles.rowStart}>
            <Text style={[styles.teamStatTitle]}>
              Win rate: {GetTeamWinRate(tournaments, item.item)} %
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  function RenderSeasonItem({ item }: any) {
    const tournaments = item
    return (
      <View style={{ width: 150, marginHorizontal: 5 }}>
        <Text>Season {tournaments[0].season}</Text>
        <FlatList
          style={{ width: '100%' }}
          data={teams}
          renderItem={(item: any) => (
            <RenderTeamsItem item={item} tournaments={tournaments} />
          )}
        />
      </View>
    )
  }

  return (
    <View>
      <Text>Y</Text>
      <FlatList
        style={{ width: '100%' }}
        horizontal
        data={GetDataBySeason()}
        renderItem={RenderSeasonItem}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
  },
  position: {
    fontSize: 24,
    fontWeight: '900',
    marginRight: 5,
    opacity: 0.3,
    width: 28,

    textAlign: 'center',
  },
  points: {
    fontSize: 16,
  },
  teamName: { fontSize: 20, flex: 1, textAlign: 'left', paddingLeft: 10 },
  teamStatBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '92%',
    marginVertical: 5,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  teamStatTitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  teamStatValue: {
    fontSize: 18,
    fontWeight: '500',
  },
})
