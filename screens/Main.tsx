import React, { useCallback, useEffect, useState } from 'react'
import {
  Animated,
  Easing,
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
  GetScore,
  GetToolRandom,
  RandomPLayerToExecute,
  RandomTeamToAttak,
} from '../functions/functions'
import colors from '../constants/colors'
import RenderLogs from '../components/RenderLog'

const NOVA: Team = {
  team: {
    name: 'NOVA',
    motivation: 0.5,
    tactic: 0.7,
    players: [
      { nickName: 'Oscare', rating: 1.55 },
      { nickName: 'Niko', rating: 1.42 },
      { nickName: 'Modest', rating: 1.36 },
      { nickName: 'b1t', rating: 1.34 },
      { nickName: 'Rain', rating: 1.28 },
    ],
  },
}

const Quazars: any = {
  team: {
    name: 'Quazars',
    motivation: 0.5,
    tactic: 0.5,
    players: [
      { nickName: 'Header', rating: 1.48 },
      { nickName: 'Xantares', rating: 1.35 },
      { nickName: 'Tabsen', rating: 1.2 },
      { nickName: 'Cloudy', rating: 1.2 },
      { nickName: 'Kosus', rating: 1.18 },
    ],
  },
}

const team1Grid = NOVA
const team2Grid = Quazars

const delay: any = 1000 // milliseconds for every action
const MRNumber: number = 15 // best of x2 rounds, need number+1 won rounds to win the game
const additionalRounds = 3 // mr after draw

const economicsRanges = [0.2, 0.4, 0.6, 0.8, 1]
const economicsWin = [0.4, 0.3, 0.25, 0.2, 0.15]
const economicsLoss = [0.1, 0.15, 0.2, 0.3, 0.4]

export default function Main() {
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const log = useSelector((state: RootState) => state.log)
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
          setGameIsActive(false)
          clearInterval(intervalId)
        } else if (
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
      }, delay)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [dispatch, gameIsActive, log])

  function ContinueGame() {
    setGameIsActive(true)
    setRounds(rounds + additionalRounds)
  }

  async function StartTheGame() {
    setRounds(MRNumber)
    dispatch(clearLog())
    let team1Value = team1Grid.team
    team1Value.economics = 0.5
    team1Value = {
      ...team1Value,
      players: team1Value.players.map((player: any) => ({
        ...player,
      })),
    }
    dispatch(updateTeam1(team1Value))

    let team2Value = team2Grid.team
    team2Value.economics = 0.5
    team2Value = {
      ...team2Value,
      players: team2Value.players.map((player: any) => ({
        ...player,
      })),
    }
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
        }}
      >
        <Text
          style={{
            width: '50%',
            fontSize: 18,
            color: '#000',
          }}
        >
          {item.nickName}
        </Text>
        <Text style={{ width: '20%', color: '#000', textAlign: 'center' }}>
          {item.rating}
        </Text>
        <Text style={{ width: '15%', color: '#000', textAlign: 'center' }}>
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.kill.team === team1.name &&
                i.kill.nickName === item.nickName
            ).length
          }
        </Text>
        <Text style={{ width: '15%', color: '#000', textAlign: 'center' }}>
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
        }}
      >
        <Text style={{ width: '20%', color: '#000', textAlign: 'center' }}>
          {item.rating}
        </Text>
        <Text style={{ width: '15%', color: '#000', textAlign: 'center' }}>
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.kill.team === team2.name &&
                i.kill.nickName === item.nickName
            ).length
          }
        </Text>
        <Text style={{ width: '15%', color: '#000', textAlign: 'center' }}>
          {
            log.filter(
              (i: any) =>
                i.status === 'kill' &&
                i.death.team === team2.name &&
                i.death.nickName === item.nickName
            ).length
          }
        </Text>
        <Text
          style={{
            width: '50%',
            fontSize: 18,
            color: '#000',
            textAlign: 'right',
          }}
        >
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
      <View style={styles.header}>
        <Text style={[styles.teamName, { color: colors.team1NameColor }]}>
          {team1.name}
        </Text>
        <Text style={styles.score}>
          {GetScore(team1, log)}-{GetScore(team2, log)}
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
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}
      >
        <View style={{ width: '50%', flexDirection: 'row' }}>
          <Text style={{ width: '50%', color: '#999' }}>name</Text>
          <Text style={{ width: '20%', color: '#999', textAlign: 'center' }}>
            R
          </Text>
          <Text style={{ width: '15%', color: '#999', textAlign: 'center' }}>
            K
          </Text>
          <Text style={{ width: '15%', color: '#999', textAlign: 'center' }}>
            D
          </Text>
        </View>
        <View
          style={{
            width: 1,
            height: '100%',
            backgroundColor: '#999',
          }}
        />
        <View style={{ width: '50%', flexDirection: 'row' }}>
          <Text style={{ width: '20%', color: '#999', textAlign: 'center' }}>
            R
          </Text>
          <Text style={{ width: '15%', color: '#999', textAlign: 'center' }}>
            K
          </Text>
          <Text style={{ width: '15%', color: '#999', textAlign: 'center' }}>
            D
          </Text>
          <Text style={{ width: '50%', color: '#999', textAlign: 'right' }}>
            name
          </Text>
        </View>
      </View>
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
          style={{ width: '50%' }}
          data={team1.players}
          renderItem={RenderPlayers1}
        />
        <View
          style={{
            width: 1,
            height: '100%',
            backgroundColor: '#999',
            marginHorizontal: 5,
          }}
        />
        <FlatList
          style={{ width: '50%' }}
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
          height: 20,
        }}
      >
        <View
          style={{
            width: '50%',
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
        <View
          style={{
            width: 1,
            height: '100%',
            backgroundColor: '#999',
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            width: '50%',
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
            {log.length > 0 && GetScore(team1, log) === GetScore(team2, log) ? (
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
            )}
          </View>
        )}
        <FlatList
          removeClippedSubviews={true}
          initialNumToRender={20}
          windowSize={10}
          data={[...log].reverse()}
          renderItem={RenderLogs}
          // keyExtractor={(item: any) => item.id}
        />
      </View>
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
    fontSize: 20,
    fontWeight: '500',
    width: '40%',
  },
  score: {
    fontSize: 24,
    fontWeight: '500',
  },
})
