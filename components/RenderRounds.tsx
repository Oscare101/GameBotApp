import { FlatList, StyleSheet, Text, View } from 'react-native'
import colors from '../constants/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GetScore } from '../functions/functions'

export default function RenderRounds(props: any) {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)

  function RenderItem(props: any) {
    return (
      <>
        <View
          style={[
            styles.winLog,
            {
              borderColor:
                props.item.win === team1.name
                  ? colors.team1NameColor
                  : colors.team2NameColor,
            },
          ]}
        >
          <Text style={styles.round}>
            round{' '}
            {log.filter((i: any) => i.status === 'win').length - props.index}{' '}
            <Text style={styles.score}>
              {GetScore(
                team1,
                log
                  .filter((i: any) => i.status === 'win')
                  .slice(
                    0,
                    log.filter((i: any) => i.status === 'win').length -
                      props.index
                  )
              )}{' '}
              -{' '}
              {GetScore(
                team2,
                log
                  .filter((i: any) => i.status === 'win')
                  .slice(
                    0,
                    log.filter((i: any) => i.status === 'win').length -
                      props.index
                  )
              )}
            </Text>
          </Text>
          <View style={styles.winBlock}>
            <Text
              style={{
                opacity: props.item.win === team1.name ? 1 : 0,
                color: colors.team1NameColor,
                fontSize: 20,
              }}
            >
              {team1.name}
            </Text>
            <View>
              <Text></Text>
            </View>
            <Text
              style={{
                opacity: props.item.win === team2.name ? 1 : 0,
                color: colors.team2NameColor,
                fontSize: 20,
              }}
            >
              {team2.name}
            </Text>
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      {props.showRounds && log.length ? (
        <View style={{ flexDirection: 'column-reverse' }}>
          <FlatList
            removeClippedSubviews={true}
            initialNumToRender={20}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            data={[...log.filter((i: any) => i.status === 'win')].reverse()}
            renderItem={({ item, index }: any) => (
              <RenderItem item={item} index={index} />
            )}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  )
}

const styles = StyleSheet.create({
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
  round: {
    fontSize: 12,
    color: '#666',
  },
  score: { fontSize: 14, color: '#000' },
  winBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
})
