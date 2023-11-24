import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function PlayersHeader(props: any) {
  return (
    <View style={[styles.playerBlock, { width: '92%', height: 50 }]}>
      <Text style={styles.playerPosition}></Text>
      <TouchableOpacity
        style={styles.playerName}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('NickName')
        }}
      >
        <Text
          style={{ fontWeight: props.sortBy === 'NickName' ? '500' : '300' }}
        >
          NickName
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playerRating}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('Rating')
        }}
      >
        <Text style={{ fontWeight: props.sortBy === 'Rating' ? '500' : '300' }}>
          Rating
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playerRole}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('Role')
        }}
      >
        <Text style={{ fontWeight: props.sortBy === 'Role' ? '500' : '300' }}>
          Role
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playerTeam}
        activeOpacity={0.8}
        onPress={() => {
          props.setSortBy('Team')
        }}
      >
        <Text style={{ fontWeight: props.sortBy === 'Team' ? '500' : '300' }}>
          Team
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
    justifyContent: 'space-between',
    padding: 5,
  },
  playerPosition: { width: '7%', fontSize: 16, fontWeight: '500' },
  playerName: { width: '30%', fontSize: 18 },
  playerRating: { width: '13%', fontSize: 16 },
  playerRole: { width: '20%', fontSize: 16, fontWeight: '300' },
  playerTeam: { width: '30%', fontSize: 16 },
})
