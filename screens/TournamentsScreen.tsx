import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Cups from '../components/Cups'

const tournamentsData: any = [
  {
    season: 1,
    name: 'Winter Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: '',
    cup: 1,
  },
  {
    season: 1,
    name: 'Spring Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    cup: 2,
  },
  {
    season: 1,
    name: 'World Qualifications',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    cup: 3,
  },
  {
    season: 1,
    name: 'Summer Stage',
    prizes: [80000, 40000, 15000, 15000],
    winner: '',
    cup: 4,
  },

  {
    season: 1,
    name: 'Autumn Stage',
    prizes: [150000, 80000, 35000, 35000],
    winner: '',
    cup: 5,
  },

  {
    season: 1,
    name: 'World Cup',
    prizes: [250000, 110000, 40000, 40000, 15000, 15000, 15000, 15000],
    winner: '',
    cup: 6,
  },
  {
    season: 1,
    name: 'Major',
    prizes: [500000, 200000, 100000, 100000, 25000, 25000, 25000, 25000],
    winner: '',
    cup: 7,
  },
]

export default function TournamentsScreen() {
  function RenderTournamentItem({ item }: any) {
    const sum = item.prizes.reduce(function (a: any, b: any) {
      return a + b
    })
    return (
      <TouchableOpacity style={[styles.tournamentBlock]} activeOpacity={0.8}>
        <View style={styles.tournamentsTopInfo}>
          <Text style={styles.tournamentName}>{item.name}</Text>
          <Text style={styles.season}>Season {item.season}</Text>
        </View>
        <View style={styles.tournamentsInfoBlock}>
          <View
            style={{
              width: '30%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cups cup={item.cup} size={40} />
          </View>
          <View style={[styles.tournamentsInfoCell, { width: '30%' }]}>
            <Text style={styles.tournamentsInfoTitle}>
              {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </Text>
            <Text style={styles.tournamentsInfoName}>Prize</Text>
          </View>
          <View style={[styles.tournamentsInfoCell, { width: '20%' }]}>
            <Text style={styles.tournamentsInfoTitle}>
              {item.prizes.length}
            </Text>
            <Text style={styles.tournamentsInfoName}>Teams</Text>
          </View>
          <View style={[styles.tournamentsInfoCell, { width: '20%' }]}>
            <Text style={styles.tournamentsInfoTitle}>
              {item.winner || '?'}
            </Text>
            <Text style={styles.tournamentsInfoName}>Winner</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />

      <Text>Tournaments</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        data={tournamentsData}
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
  },
  season: {
    fontSize: 16,
    opacity: 0.8,
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
  tournamentsInfoName: { fontSize: 16 },
})
