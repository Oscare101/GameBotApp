import { StyleSheet, Text, View } from 'react-native'
import colors from '../constants/colors'
import { GetMapsScore, GetScore } from '../functions/functions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function ScoreBlock() {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  const mapPoints = useSelector((state: RootState) => state.mapPoints)

  return (
    <View style={styles.header}>
      <Text style={[styles.teamName, { color: colors.team1NameColor }]}>
        {team1.name}
      </Text>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Text style={styles.score}>
          {GetScore(team1, log)} - {GetScore(team2, log)}
        </Text>
        <Text style={styles.mapPoints}>
          {GetMapsScore(team1, mapPoints)} - {GetMapsScore(team2, mapPoints)}
        </Text>
      </View>

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
  mapPoints: {
    fontSize: 16,
  },
})
