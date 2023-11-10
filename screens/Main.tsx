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
  RandomPLayerToExecute,
  RandomTeamToAttak,
} from '../functions/functions'
import colors from '../constants/colors'
import RenderLogs from '../components/RenderLog'
import TeamHeader from '../components/TeamHeader'
import ScoreBlock from '../components/ScoreBlock'
import mapPoints, { clearMapPoints, updateMapPoints } from '../redux/mapPoints'

const NOVA: Team = {
  team: {
    name: 'NOVA',
    motivation: 0.7,
    tactic: 0.7,
    players: [
      { nickName: 'Oscare', rating: 1.75 },
      { nickName: 'Modest', rating: 1.44 },
      { nickName: 'Niko', rating: 1.43 },
      { nickName: 'b1t', rating: 1.39 },
      { nickName: 'Refresh', rating: 1.3 },
    ],
  },
}

const Quazars: any = {
  team: {
    name: 'Quazars',
    motivation: 0.5,
    tactic: 0.6,
    players: [
      { nickName: 'Header', rating: 1.52 },
      { nickName: 'Xantares', rating: 1.36 },
      { nickName: 'Rain', rating: 1.28 },
      { nickName: 'Tabsen', rating: 1.2 },
      { nickName: 'Cloudy', rating: 1.2 },
    ],
  },
}

const OG: any = {
  team: {
    name: 'OG',
    motivation: 0.7,
    tactic: 0.6,
    players: [
      { nickName: 'Olaph', rating: 1.43 },
      { nickName: 'Nelo', rating: 1.34 },
      { nickName: 'Rossander', rating: 1.3 },
      { nickName: 'Focus', rating: 1.27 },
      { nickName: 'Torin', rating: 1.24 },
    ],
  },
}

const Vangard: any = {
  team: {
    name: 'Vangard',
    motivation: 0.5,
    tactic: 0.3,
    players: [
      { nickName: 'Collector', rating: 1.36 },
      { nickName: 'Kscerato', rating: 1.25 },
      { nickName: 'Fury', rating: 1.25 },
      { nickName: 'Tenor', rating: 1.24 },
      { nickName: 'Stoic', rating: 1.23 },
    ],
  },
}

const other: any = {
  team: {
    name: 'other',
    motivation: 0.5,
    tactic: 0.5,
    players: [
      { nickName: 'Salivan', rating: 1.26 },
      { nickName: 'Wong', rating: 1.24 },
      { nickName: 'Cicada', rating: 1.23 },
      { nickName: 'LoswIt', rating: 1.22 },
      { nickName: 'Syrson', rating: 1.22 },
    ],
  },
}

const team1Grid = OG
const team2Grid = Quazars

const delay: any = 10 // milliseconds for every action
const showLogs: boolean = false
const bestOf: number = 3
const MRNumber: number = 3 // best of x2 rounds, need number+1 won rounds to win the game
const additionalRounds = 3 // mr after draw

export default function Main() {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
  const mapPoints = useSelector((state: RootState) => state.mapPoints)

  const [rounds, setRounds] = useState<number>(0)

  const dispatch = useDispatch()

  const [gameIsActive, setGameIsActive] = useState<boolean>(false)

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

    let team1Value = team1Grid.team
    team1Value.economics = 0.5
    dispatch(updateTeam1(team1Value))

    let team2Value = team2Grid.team
    team2Value.economics = 0.5
    dispatch(updateTeam2(team2Value))
    setGameIsActive(true)
  }

  async function StartTheGame() {
    setRounds(MRNumber)

    dispatch(clearLog())
    dispatch(clearMapPoints())

    let team1Value = team1Grid.team
    team1Value.economics = 0.5
    dispatch(updateTeam1(team1Value))

    let team2Value = team2Grid.team
    team2Value.economics = 0.5
    dispatch(updateTeam2(team2Value))
    setGameIsActive(true)
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
      <ScoreBlock bestOf={bestOf} rounds={rounds} MRNumber={MRNumber} />
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
        <FlatList
          style={{ flex: 1 }}
          data={team1.players}
          renderItem={RenderPlayers1}
        />
        <View style={styles.separator} />
        <FlatList
          style={{ flex: 1 }}
          data={team2.players}
          renderItem={RenderPlayers2}
        />
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
        {gameIsActive ? (
          <></>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={StartTheGame}
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
                Start The Game
              </Text>
            </TouchableOpacity>
            {/* {log.length > 0 && GetScore(team1, log) === GetScore(team2, log) ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={ContinueGame}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  backgroundColor: '#666',
                  borderRadius: 10,
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 28, color: '#fff' }}>Additional</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )} */}
          </View>
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userName: {
    width: '55%',
    fontSize: 18,
    color: '#000',
    paddingHorizontal: 5,
  },
  userRating: {
    fontSize: 10,
    width: '19%',
    color: '#000',
    textAlign: 'center',
    opacity: 0.5,
  },
  userKill: {
    fontSize: 16,
    width: '13%',
    color: '#000',
    textAlign: 'center',
  },

  userDeath: {
    fontSize: 16,
    width: '13%',
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
