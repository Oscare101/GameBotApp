import { StyleSheet, Text, View } from 'react-native'
import colors from '../constants/colors'
import { GetScore } from '../functions/functions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function ScoreBlock() {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  return (
    <View style={styles.header}>
      <Text style={[styles.teamName, { color: colors.team1NameColor }]}>
        {team1.name}
      </Text>
      <Text style={styles.score}>
        {GetScore(team1, log)} - {GetScore(team2, log)}
      </Text>
      <Text
        style={[
          styles.teamName,
          { color: colors.team2NameColor, textAlign: 'right' },
        ]}
      >
        {team2.name}
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  teamName: {
    fontSize: 25,
    fontWeight: '500',
    width: '40%',
  },
  score: {
    fontSize: 28,
    fontWeight: '500',
  },
})
