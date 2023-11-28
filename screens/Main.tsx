import { useEffect, useState } from 'react'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { updateTeam1 } from '../redux/team1'
import { Player, Team } from '../constants/interfaces'
import { updateTeam2 } from '../redux/team2'
import { clearLog, updateLog } from '../redux/logs'
import {
  ExperienceChange,
  GetAlivePlayers,
  GetDeadPlayerInRound,
  GetDeaths,
  GetEconomics,
  GetKills,
  GetMapsScore,
  GetRounds,
  GetScore,
  GetSortedPlayersByRating,
  GetTeamRating,
  GetToolRandom,
  InstantGame,
  MotivationChange,
  RandomPLayerToExecute,
  RandomTeamToAttak,
  RatingChange,
  TacticChange,
} from '../functions/functions'
import colors from '../constants/colors'
import RenderLogs from '../components/RenderLog'
import TeamHeader from '../components/TeamHeader'
import ScoreBlock from '../components/ScoreBlock'
import mapPoints, { clearMapPoints, updateMapPoints } from '../redux/mapPoints'
import RenderRounds from '../components/RenderRounds'
import { updatePlayers } from '../redux/players'
import AsyncStorage from '@react-native-async-storage/async-storage'
import rules from '../constants/rules'
import ExplainingModal from '../components/ExplainingModal'
import { Ionicons } from '@expo/vector-icons'
const showLogs: boolean = false
const showRounds: boolean = false

export default function Main(props: any) {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  const mapPoints = useSelector((state: RootState) => state.mapPoints)
  const players = useSelector((state: RootState) => state.players)

  const [logsState, setLogsState] = useState<any[]>([])
  const [rounds, setRounds] = useState<number>(0)
  const [explainingModal, setExplainingModal] = useState<boolean>(false)

  const dispatch = useDispatch()

  const [gameIsActive, setGameIsActive] = useState<boolean>(false)

  async function AfterMatchPlayersDinamics(winnersArr: any) {
    const newPlayersArr = GetSortedPlayersByRating(players).map((i: Player) => {
      if (i.team === team1.name || i.team === team2.name) {
        return {
          ...i,
          rating: +RatingChange(i.rating).toFixed(2),
          motivation: +MotivationChange(i, team1, team2, winnersArr).toFixed(2),
          tactic: +TacticChange(i, team1, team2, winnersArr).toFixed(2),
          experience: +ExperienceChange(i.experience).toFixed(2),
        }
      } else {
        return i
      }
    })
    dispatch(updatePlayers(newPlayersArr))
    await AsyncStorage.setItem('players', JSON.stringify(newPlayersArr))
  }

  useEffect(() => {
    if (gameIsActive) {
      const intervalId = setInterval(async () => {
        if (
          GetScore(team1, log) + GetScore(team2, log) === rounds * 2 ||
          GetScore(team1, log) === rounds + 1 ||
          GetScore(team2, log) === rounds + 1
        ) {
          if (GetScore(team1, log) !== GetScore(team2, log)) {
            setLogsState(logsState.concat(log))
            let winnersArr: any = []
            mapPoints.forEach((point: string) => {
              winnersArr.push(point)
            })

            if (GetScore(team1, log) === rounds + 1) {
              dispatch(updateMapPoints(team1.name))
              winnersArr.push(team1.name)
            } else {
              dispatch(updateMapPoints(team2.name))
              winnersArr.push(team2.name)
            }

            if (
              GetMapsScore(team1, winnersArr) ===
                Math.floor(rules.bestOf / 2 + 1) ||
              GetMapsScore(team2, winnersArr) ===
                Math.floor(rules.bestOf / 2 + 1)
            ) {
              clearInterval(intervalId)
              await AfterMatchPlayersDinamics(winnersArr)

              setGameIsActive(false)
              props.onWinners(team1, team2, winnersArr)
            } else {
              StartTheNewMap()
            }
          } else if (GetScore(team1, log) === GetScore(team2, log)) {
            setGameIsActive(false)
            clearInterval(intervalId)
            ContinueGame()
          } else {
            setGameIsActive(false)
            clearInterval(intervalId)
          }
        } else {
          if (
            GetAlivePlayers(team1, log).length > 0 &&
            GetAlivePlayers(team2, log).length > 0
          ) {
            const teamAttackQueue = RandomTeamToAttak(team1, team2)
            const playerExecute = RandomPLayerToExecute(teamAttackQueue, log)

            dispatch(
              updateLog({
                status: 'kill',
                kill: {
                  nickName: playerExecute[0].nickName,
                  team: teamAttackQueue[0].name,
                },
                death: {
                  nickName: playerExecute[1].nickName,
                  team: teamAttackQueue[1].name,
                },
                tool: GetToolRandom(),
                id: new Date().getTime().toString(),
              })
            )
          } else {
            if (GetAlivePlayers(team1, log).length === 0) {
              dispatch(
                updateLog({
                  status: 'win',
                  win: team2.name,
                  id: new Date().getTime().toString(),
                })
              )
              let team1Value = team1
              team1Value = {
                ...team1Value,
                economics: GetEconomics(team1.economics, false),
              }
              dispatch(updateTeam1(team1Value))
              let team2Value = team2
              team2Value = {
                ...team2Value,
                economics: GetEconomics(team2.economics, true),
              }
              dispatch(updateTeam2(team2Value))
            } else {
              dispatch(
                updateLog({
                  status: 'win',
                  win: team1.name,
                  id: new Date().getTime().toString(),
                })
              )
              let team1Value = team1
              team1Value = {
                ...team1Value,
                economics: GetEconomics(team1.economics, true),
              }
              dispatch(updateTeam1(team1Value))
              let team2Value = team2
              team2Value = {
                ...team2Value,
                economics: GetEconomics(team2.economics, false),
              }
              dispatch(updateTeam2(team2Value))
            }
            // ClearDeath()
          }
        }
      }, rules.tactTimeout)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [dispatch, gameIsActive, log])

  function ContinueGame() {
    let team1Value = team1
    team1Value = {
      ...team1Value,
      economics: 0.5,
    }
    dispatch(updateTeam1(team1Value))

    let team2Value = team2
    team2Value = {
      ...team2Value,
      economics: 0.5,
    }
    dispatch(updateTeam2(team2Value))

    setRounds(rounds + rules.additionalRounds)
    setGameIsActive(true)
  }

  async function StartTheNewMap() {
    setRounds(rules.MRNumber)
    dispatch(clearLog())

    let team1Value = team1
    team1Value.economics = 0.5
    dispatch(updateTeam1(team1Value))

    let team2Value = team2
    team2Value.economics = 0.5
    dispatch(updateTeam2(team2Value))
    setGameIsActive(true)
  }

  async function StartTheGame() {
    // SetTeams()
    if (team1.name && team2.name) {
      setRounds(rules.MRNumber)
      setLogsState([])

      dispatch(clearLog())
      dispatch(clearMapPoints())

      setGameIsActive(true)
    }
  }

  function RenderPlayers1({ item }: any) {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          opacity: GetDeadPlayerInRound(item, log) ? 0.5 : 1,
          backgroundColor: GetDeadPlayerInRound(item, log)
            ? '#00000000'
            : '#fff',
          borderRadius: 5,
          marginVertical: 2,
          alignItems: 'center',
        }}
      >
        <Text style={styles.userName}>{item.nickName}</Text>
        <Text style={styles.userRating}>{item.rating}</Text>
        <Text style={styles.userDeath}>
          {GetKills(log, item.nickName, team1.name)}
        </Text>
        <Text style={styles.userKill}>
          {GetDeaths(log, item.nickName, team1.name)}
        </Text>
      </View>
    )
  }

  function RenderPlayers2({ item }: any) {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          opacity: GetDeadPlayerInRound(item, log) ? 0.5 : 1,
          backgroundColor: GetDeadPlayerInRound(item, log)
            ? '#00000000'
            : '#fff',
          borderRadius: 5,
          marginVertical: 2,
          alignItems: 'center',
        }}
      >
        <Text style={styles.userKill}>
          {GetKills(log, item.nickName, team2.name)}
        </Text>
        <Text style={styles.userDeath}>
          {GetDeaths(log, item.nickName, team2.name)}
        </Text>
        <Text style={styles.userRating}>{item.rating}</Text>

        <Text style={[styles.userName, { textAlign: 'right' }]}>
          {item.nickName}
        </Text>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#eee',
      }}
    >
      <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />
      <ScoreBlock
        bestOf={rules.bestOf}
        rounds={rounds}
        MRNumber={rules.MRNumber}
        gameIsActive={true}
      />
      <TeamHeader />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
      >
        {team1.name ? (
          <FlatList
            style={{ flex: 1 }}
            data={team1.players}
            renderItem={RenderPlayers1}
          />
        ) : (
          <View style={{ flex: 1 }}></View>
        )}

        <View style={styles.separator} />
        {team2.name ? (
          <FlatList
            style={{ flex: 1 }}
            data={team2.players}
            renderItem={RenderPlayers2}
          />
        ) : (
          <View style={{ flex: 1 }}></View>
        )}
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          height: 10,
          marginVertical: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              height: '100%',
              backgroundColor: colors.team1EconomicsColor,
              width: `${team1.economics ? team1.economics * 100 : 0}%`,
            }}
          ></View>
        </View>
        <View style={styles.separator} />
        <View
          style={{
            flex: 1,
            height: '100%',
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: '#fff',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              height: '100%',
              backgroundColor: colors.team2EconomicsColor,
              width: `${team2.economics ? team2.economics * 100 : 0}%`,
            }}
          ></View>
        </View>
      </View>
      <View style={{ width: '100%', padding: 10, alignItems: 'center' }}>
        {!gameIsActive && team1.name && team2.name && !log.length ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={StartTheGame}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: '#9dbef2',
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 28, color: '#fff' }}>
                Start The Game
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
        {gameIsActive ? (
          <></>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onClose()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              // backgroundColor: '#666',
              borderRadius: 10,
              width: '100%',
              marginTop: 20,
              borderColor: '#9dbef2',
              borderWidth: 3,
            }}
          >
            <Text style={{ fontSize: 28, color: '#9dbef2' }}>Back</Text>
          </TouchableOpacity>
        )}
        {showLogs ? (
          <FlatList
            removeClippedSubviews={true}
            initialNumToRender={20}
            windowSize={10}
            data={[...log].reverse()}
            renderItem={(item: any) => <RenderLogs item={item.item} />}
          />
        ) : (
          <></>
        )}
        <RenderRounds showRounds={showRounds} />
      </View>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        activeOpacity={0.8}
        onPress={() => setExplainingModal(true)}
      >
        <Text style={{ fontSize: 20, marginRight: 5 }}>
          How do matches work
        </Text>
        <Ionicons name="open-outline" size={24} color="black" />
      </TouchableOpacity>
      <ExplainingModal
        visible={explainingModal}
        onClose={() => setExplainingModal(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  userName: {
    width: '60%',
    fontSize: 18,
    color: '#000',
    paddingHorizontal: 5,
  },
  userRating: {
    fontSize: 10,
    width: '16%',
    color: '#000',
    textAlign: 'center',
    opacity: 0.5,
  },
  userKill: {
    fontSize: 16,
    width: '12%',
    color: '#000',
    textAlign: 'center',
  },

  userDeath: {
    fontSize: 16,
    width: '12%',
    color: '#000',
    textAlign: 'center',
  },

  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#999',
    marginHorizontal: 5,
  },
})
