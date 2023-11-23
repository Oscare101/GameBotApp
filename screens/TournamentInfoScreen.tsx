import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import CupsBig from '../components/CupsBIG'
const width = Dimensions.get('screen').width

export default function TournamentInfoScreen({ route }: any) {
  function RenderBigPrizes({ item, index }: any) {
    return (
      <View
        style={{
          backgroundColor: '#ddd',
          width: (width * 0.92) / 2 - width * 0.02,
          marginLeft: index % 2 == 1 ? width * 0.04 : 0,
          marginTop: width * 0.04,
          padding: 10,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
        }}
      >
        <Text>
          {index === 0
            ? '1st'
            : index === 1
            ? '2nd'
            : index >= 2 && index <= 3
            ? '3-4th'
            : index >= 4 && index <= 7
            ? '5-8th'
            : index >= 8 && index <= 15
            ? '9-16th'
            : ''}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tournamentName}>{route.params.tournament.name}</Text>
      <CupsBig cup={route.params.tournament.cup} />
      <Text style={styles.prizeDistribution}>Prize distribution</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '92%',
        }}
      >
        {/* {route.params.tournament.prizes.map((item: any, index: number) => (
          <RenderBigPrizes key={index} item={item} index={index} />
        ))} */}
      </View>
      <FlatList
        style={{ width: '92%' }}
        data={route.params.tournament.prizes}
        renderItem={RenderBigPrizes}
        numColumns={2}
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
  tournamentName: { fontSize: 30, fontWeight: '500', marginBottom: 20 },
  prizeDistribution: {
    fontSize: 18,
    textAlign: 'left',
    width: '92%',
    marginTop: width * 0.04,
  },
})
