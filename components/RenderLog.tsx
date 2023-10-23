import { StyleSheet, Text, View } from 'react-native'
import colors from '../constants/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function RenderLogs({ item }: any) {
  const team1 = useSelector((state: RootState) => state.team1.team)

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
    borderBottomWidth: 2,
    borderColor: colors.dead,
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  playerKill: {
    fontSize: 16,
    marginRight: 10,
  },
  playerDead: {
    fontSize: 16,
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
    borderBottomWidth: 2,
  },
})
