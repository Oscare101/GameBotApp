import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Cups from '../components/Cups'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import Teams from '../components/Teams'
import tournamentsDefault from '../constants/tournamentsDefault'
import { updateTournaments } from '../redux/tournaments'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GetTournamentsBySeason } from '../functions/functions'
import { Ionicons } from '@expo/vector-icons'
export default function TournamentsScreen({ navigation }: any) {
  const tournaments: any = useSelector((state: RootState) => state.tournaments)
  const dispatch = useDispatch()

  async function StartNewSeason() {
    const newSeason = tournamentsDefault.map((t: any) => {
      return {
        ...t,
        season: tournaments[tournaments.length - 1].season + 1,
      }
    })
    const newTournaments = tournaments.concat(newSeason)
    dispatch(updateTournaments(newTournaments))
    AsyncStorage.setItem('tournaments', JSON.stringify(newTournaments))
  }

  function RenderTournamentItem({ item, index }: any) {
    const sum = item.prizes.reduce(function (a: any, b: any) {
      return a + b
    })
    return (
      <>
        {index === 0 ||
        GetTournamentsBySeason(tournaments)[index - 1].season !==
          item.season ? (
          <View
            style={{
              width: '92%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: '#666' }} />
            <Text
              style={{
                fontSize: 20,
                padding: 5,
                color: '#666',
                fontWeight: '400',
                letterSpacing: 1,
              }}
            >
              season {item.season}
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#666' }} />
          </View>
        ) : (
          <></>
        )}
        <TouchableOpacity
          style={[styles.tournamentBlock]}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('TournamentInfoScreen', { tournament: item })
          }
        >
          <View style={styles.tournamentsTopInfo}>
            <Text style={styles.tournamentName}>{item.name}</Text>
            <Text style={styles.season}>Season {item.season}</Text>
          </View>
          <View style={styles.tournamentsInfoBlock}>
            <View
              style={{
                width: '20%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cups cup={item.cup} />
            </View>
            <View style={[styles.tournamentsInfoCell, { width: '30%' }]}>
              <Text style={styles.tournamentsInfoTitle}>
                {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $
              </Text>
              <Text style={styles.tournamentsInfoName}>Prize</Text>
            </View>
            <View style={[styles.tournamentsInfoCell, { width: '20%' }]}>
              <Text style={styles.tournamentsInfoTitle}>
                {item.prizes.length}
              </Text>
              <Text style={styles.tournamentsInfoName}>Teams</Text>
            </View>
            <View style={[styles.tournamentsInfoCell, { width: '30%' }]}>
              {item.winner ? (
                <Teams team={item.winner.team.name} />
              ) : item.grid.length ? (
                <Ionicons name="ios-time-outline" size={24} color="black" />
              ) : (
                <Text style={styles.tournamentsInfoTitle}>-</Text>
              )}

              <Text style={styles.tournamentsInfoName}>Winner</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />

      <Text style={styles.screenTitle}>Tournaments</Text>
      {tournaments.find((t: any) => !t.winner) ? (
        <></>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={StartNewSeason}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: '#9dbef2',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 28, color: '#fff' }}>Start new season</Text>
        </TouchableOpacity>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        data={GetTournamentsBySeason(tournaments)}
        renderItem={RenderTournamentItem}
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
  screenTitle: {
    fontSize: 24,
  },
  tournamentBlock: {
    width: '92%',
    alignSelf: 'center',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    backgroundColor: '#fff',
  },
  tournamentsTopInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: '500',
  },
  season: {
    fontSize: 18,
    opacity: 0.8,
    fontWeight: '300',
  },
  tournamentsInfoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    width: '100%',
    paddingTop: 5,
    marginTop: 5,
    borderColor: '#aaa',
  },
  tournamentsInfoCell: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tournamentsInfoTitle: { fontSize: 20, fontWeight: '500' },
  tournamentsInfoName: { fontSize: 16, fontWeight: '300' },
})
