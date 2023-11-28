import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from '../constants/colors'
import { GetMapsScore, GetScore, GetTeams } from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { useState } from 'react'
import Teams from './Teams'
import { updateTeam1 } from '../redux/team1'
import { Player, Team } from '../constants/interfaces'
import { updateTeam2 } from '../redux/team2'

export default function ScoreBlock(props: any) {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  const players = useSelector((state: RootState) => state.players)

  const mapPoints = useSelector((state: RootState) => state.mapPoints)
  const dispatch = useDispatch()
  const [team1Modal, setTeam1Modal] = useState<boolean>(false)
  const [team2Modal, setTeam2Modal] = useState<boolean>(false)

  function RenderTeams({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
        activeOpacity={0.8}
        onPress={() => {
          const t: Team = {
            team: {
              name: item as string,
              motivation:
                players
                  .filter((player: any) => player.team === item)
                  .reduce((a, b) => a + b.motivation, 0) / 5,
              tactic:
                players
                  .filter((player: any) => player.team === item)
                  .reduce((a, b) => a + b.tactic, 0) / 5,
              experience:
                players
                  .filter((player: any) => player.team === item)
                  .reduce((a, b) => a + b.experience, 0) / 5,
              economics: 0.5,
              players: players.filter((player: any) => player.team === item),
            },
          }
          if (team1Modal) {
            dispatch(updateTeam1(t.team))
            setTeam1Modal(false)
          } else {
            dispatch(updateTeam2(t.team))
            setTeam2Modal(false)
          }
        }}
      >
        <Teams team={item} />
        <Text style={{ fontSize: 20, paddingLeft: 15 }}>{item}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Text style={{ fontSize: 12, paddingBottom: 10 }}>
        best of {props.MRNumber * 2}{' '}
        {props.rounds > props.MRNumber
          ? `[ +${(props.rounds - props.MRNumber) * 2} overtime rounds ]`
          : ''}
      </Text>

      <View style={styles.header}>
        <View
          style={{
            width: '40%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            opacity: team1.name
              ? GetMapsScore(team2, mapPoints) ===
                  Math.floor(props.bestOf / 2 + 1) && props.gameIsActive
                ? 0.5
                : 1
              : 0.3,
          }}
        >
          {team1.name ? <Teams team={team1.name} /> : <></>}
          <Text
            style={[
              styles.teamName,
              {
                color: colors.team1NameColor,

                paddingLeft: 5,
              },
            ]}
          >
            {team1.name || 'team 1'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '20%',
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                styles.score,
                {
                  width: '40%',
                  textAlign: 'right',
                },
              ]}
            >
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
            <Text
              style={[
                styles.score,
                {
                  width: '40%',
                  textAlign: 'left',
                },
              ]}
            >
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
                        GetMapsScore(team1, mapPoints) > index &&
                        props.gameIsActive
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
                        GetMapsScore(team2, mapPoints) > index &&
                        props.gameIsActive
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
        </View>

        <View
          style={{
            width: '40%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            opacity: team2.name
              ? GetMapsScore(team1, mapPoints) ===
                  Math.floor(props.bestOf / 2 + 1) && props.gameIsActive
                ? 0.5
                : 1
              : 0.3,
          }}
        >
          <Text
            style={[
              styles.teamName,
              {
                color: colors.team2NameColor,
                textAlign: 'right',

                paddingRight: 5,
              },
            ]}
          >
            {team2.name || 'team 2'}
          </Text>
          {team2.name ? <Teams team={team2.name} /> : <></>}
        </View>
      </View>
    </>
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
    fontSize: 22,
    fontWeight: '500',
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
