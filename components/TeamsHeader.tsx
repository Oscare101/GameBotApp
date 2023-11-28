import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TeamsHeader(props: any) {
  return (
    <View style={[styles.playerBlock, { width: '92%', height: 50 }]}>
      <TouchableOpacity
        style={styles.sortButton}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('RatingYearly')
        }}
      >
        <Text
          style={{
            fontWeight: props.sortBy === 'RatingYearly' ? '500' : '300',
          }}
        >
          Season points
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sortButton}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('Prizes')
        }}
      >
        <Text style={{ fontWeight: props.sortBy === 'Prizes' ? '500' : '300' }}>
          Prizes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sortButton}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('WinRate')
        }}
      >
        <Text
          style={{ fontWeight: props.sortBy === 'WinRate' ? '500' : '300' }}
        >
          WinRate
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  playerBlock: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 5,
  },
  sortButton: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  playerName: {},
  playerRating: {},
  playerRole: {},
  playerTeam: {},
})
