import { StyleSheet, Text, View } from 'react-native'
import team1 from '../redux/team1'
import colors from '../constants/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function RenderLogs({ item }: any) {
  return (
    <>
      {item.status === 'kill' ? (
        <View style={styles.killLog}>
          <Text
            style={[
              styles.playerKill,
              {
                color:
                  item.kill.team === team1.name
                    ? colors.team1NameColor
                    : colors.team2NameColor,
              },
            ]}
          >
            {item.kill.nickName}
          </Text>
          <MaterialCommunityIcons name={item.tool} size={24} color="black" />
          <Text
            style={[
              styles.playerDead,
              {
                color: colors.dead,
              },
            ]}
          >
            {item.death.nickName}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.winLog,
            {
              borderColor:
                item.win === team1.name
                  ? colors.team1NameColor
                  : colors.team2NameColor,
            },
          ]}
        >
          <Text
            style={[
              styles.playerKill,
              {
                color:
                  item.win === team1.name
                    ? colors.team1NameColor
                    : colors.team2NameColor,
              },
            ]}
          >
            {item.win}
          </Text>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  killLog: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.shadowBG,
    borderWidth: 1,
    borderColor: colors.dead,
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  playerKill: {
    fontSize: 18,
    marginRight: 10,
  },
  playerDead: {
    fontSize: 18,
    marginLeft: 10,
  },
  winLog: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: colors.shadowBG,
    borderWidth: 1,
  },
})
