import { StyleSheet, Text, View } from 'react-native'
import colors from '../constants/colors'
import { GetMapsScore, GetScore } from '../functions/functions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function ScoreBlock(props: any) {
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
          width: '20%',
        }}
      >
        {props.rounds > props.MRNumber ? (
          <Text style={{ fontSize: 12 }}>
            +{(props.rounds - props.MRNumber) * 2} additional rounds
          </Text>
        ) : (
          <></>
        )}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[styles.score, { width: '40%', textAlign: 'right' }]}>
            {GetScore(team1, log)}
          </Text>
          <Text
            style={[
              styles.score,
              { width: '20%', textAlign: 'center', color: '#ddd' },
            ]}
          >
            -
          </Text>
          <Text style={[styles.score, { width: '40%', textAlign: 'left' }]}>
            {GetScore(team2, log)}
          </Text>
        </View>

        <View style={styles.bestOfBlock}>
          <View
            style={{
              flexDirection: 'column-reverse',
              width: '40%',
            }}
          >
            {Array.from(
              { length: Math.floor(props.bestOf / 2 + 1) },
              (_, index) => (
                <View
                  key={index}
                  style={{
                    height: 7,
                    width: '100%',
                    backgroundColor:
                      GetMapsScore(team1, mapPoints) > index
                        ? colors.team1NameColor
                        : '#eee',
                    marginBottom: 5,
                    borderRadius: 10,
                  }}
                />
              )
            )}
          </View>
          <View
            style={{
              flexDirection: 'column-reverse',
              width: '40%',
            }}
          >
            {Array.from(
              { length: Math.floor(props.bestOf / 2 + 1) },
              (_, index) => (
                <View
                  key={index}
                  style={{
                    height: 7,
                    width: '100%',
                    backgroundColor:
                      GetMapsScore(team2, mapPoints) > index
                        ? colors.team2NameColor
                        : '#eee',
                    marginBottom: 5,
                    borderRadius: 10,
                  }}
                />
              )
            )}
          </View>
        </View>
        {/* <Text style={styles.mapPoints}>
          {GetMapsScore(team1, mapPoints)} - {GetMapsScore(team2, mapPoints)}
        </Text>
        <Text style={styles.bestOf}>best of {props.bestOf}</Text> */}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  teamName: {
    fontSize: 25,
    fontWeight: '500',
    width: '40%',
  },
  score: {
    fontSize: 24,
    fontWeight: '500',
  },
  bestOfBlock: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-between',
  },
})
