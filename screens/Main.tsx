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
import { Team } from '../constants/interfaces'
import { updateTeam2 } from '../redux/team2'
import { clearLog, updateLog } from '../redux/logs'
import {
  GetAlivePlayers,
  GetDeadPlayerInRound,
  GetEconomics,
  GetMapsScore,
  GetScore,
  GetToolRandom,
  InstantGame,
  RandomPLayerToExecute,
  RandomTeamToAttak,
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

const delay: any = 10 // milliseconds for every action
const showLogs: boolean = false
const showRounds: boolean = false
const bestOf: number = 3
const MRNumber: number = 15 // best of x2 rounds, need number+1 won rounds to win the game
const additionalRounds = 3 // mr after draw

export default function Main() {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  const mapPoints = useSelector((state: RootState) => state.mapPoints)
  const players = useSelector((state: RootState) => state.players)

  const [rounds, setRounds] = useState<number>(0)

  const dispatch = useDispatch()

  const [gameIsActive, setGameIsActive] = useState<boolean>(false)

  function GetSortedPlayersByRating() {
    let arr: any = []
    players.forEach((i: any) => {
      arr.push(i)
    })
    arr.sort((a: any, b: any) => b.rating - a.rating)
    return arr
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
              GetMapsScore(team1, winnersArr) === Math.floor(bestOf / 2 + 1) ||
              GetMapsScore(team2, winnersArr) === Math.floor(bestOf / 2 + 1)
            ) {
              setGameIsActive(false)
              clearInterval(intervalId)
              const newPlayersArr = GetSortedPlayersByRating().map((i: any) => {
                if (i.team === team1.name || i.team === team2.name) {
                  return {
                    ...i,
                    rating: +(
                      Math.random() > 0.5 ? i.rating + 0.01 : i.rating - 0.01
                    ).toFixed(2),
                  }
                } else {
                  return i
                }
              })
              dispatch(updatePlayers(newPlayersArr))
              await AsyncStorage.setItem(
                'players',
                JSON.stringify(newPlayersArr)
              )

              // if (
              //   GetMapsScore(team1, winnersArr) >
              //   GetMapsScore(team2, winnersArr)
              // ) {
              //   const newPlayersArr = GetSortedPlayersByRating().map(
              //     (i: any) => {
              //       if (i.team === team1.name) {
              //         return { ...i, tactic: i.tactic + 0.01 }
              //       } else {
              //         return i
              //       }
              //     }
              //   )
              //   dispatch(updatePlayers(newPlayersArr))
              //   await AsyncStorage.setItem(
              //     'players',
              //     JSON.stringify(newPlayersArr)
              //   )
              // } else {
              //   const newPlayersArr = GetSortedPlayersByRating().map(
              //     (i: any) => {
              //       if (i.team === team2.name) {
              //         return { ...i, tactic: i.tactic + 0.01 }
              //       } else {
              //         return i
              //       }
              //     }
              //   )
              //   dispatch(updatePlayers(newPlayersArr))
              //   await AsyncStorage.setItem(
              //     'players',
              //     JSON.stringify(newPlayersArr)
              //   )
              // }
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
      }, delay)
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

    setRounds(rounds + additionalRounds)
    setGameIsActive(true)
  }

  async function StartTheNewMap() {
    setRounds(MRNumber)
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
      setRounds(MRNumber)

      dispatch(clearLog())
      dispatch(clearMapPoints())

      setGameIsActive(true)
    }
  }

  async function ClearGame() {
    setRounds(MRNumber)

    dispatch(clearLog())
    dispatch(clearMapPoints())

    let team1Value = {
      name: '',
      players: [{ nickName: '-', rating: 0 }],
    }
    dispatch(updateTeam1(team1Value))

    let team2Value = {
      name: '',
      players: [{ nickName: '-', rating: 0 }],
    }
    dispatch(updateTeam2(team2Value))
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
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.kill.team === team1.name &&
                i.kill.nickName === item.nickName
            ).length
          }
        </Text>
        <Text style={styles.userKill}>
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.death.team === team1.name &&
                i.death.nickName === item.nickName
            ).length
          }
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
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.kill.team === team2.name &&
                i.kill.nickName === item.nickName
            ).length
          }
        </Text>
        <Text style={styles.userDeath}>
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.death.team === team2.name &&
                i.death.nickName === item.nickName
            ).length
          }
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
        bestOf={bestOf}
        rounds={rounds}
        MRNumber={MRNumber}
        gameIsActive={gameIsActive}
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
      <View
        style={{ width: '100%', flex: 1, padding: 10, alignItems: 'center' }}
      >
        {!gameIsActive && team1.name && team2.name ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={log.length ? ClearGame : StartTheGame}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: '#666',
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 28, color: '#fff' }}>
                {log.length
                  ? 'Clear'
                  : team1.name
                  ? 'Start The Game'
                  : 'Set teams'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            () => {
              const winnersArr = InstantGame(
                NOVA.team,
                OG.team,
                bestOf,
                MRNumber,
                additionalRounds
              )
            }
            // TODO FIX this shit
          }
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: '#f0f',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 28, color: '#fff' }}>
            {log.length ? 'Clear' : team1.name ? 'Start The Game' : 'Set teams'}
          </Text>
        </TouchableOpacity> */}
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
