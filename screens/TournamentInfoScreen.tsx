import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CupsBig from '../components/CupsBIG'
import { Ionicons } from '@expo/vector-icons'
import GrandSlamModal from '../components/GrandSlamModal'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { updateTournaments } from '../redux/tournaments'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Team, Tournament } from '../constants/interfaces'
import { updateTeam1 } from '../redux/team1'
import { updateTeam2 } from '../redux/team2'
import { GetMapsScore, GetScore } from '../functions/functions'
import Main from './Main'
import { clearLog } from '../redux/logs'

const width = Dimensions.get('screen').width

export default function TournamentInfoScreen({ route, navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)
  const log = useSelector((state: RootState) => state.log)

  const [tournament, setTournament] = useState<Tournament>(
    route.params.tournament
  )
  const [gameScreen, setGameScreen] = useState<boolean>(false)
  const [gridCell, setGridCell] = useState<any>(null)
  const dispatch = useDispatch()

  const [grandSlamModal, setGrandSlamModal] = useState<boolean>(false)

  function RenderBigPrizes({ item, index }: any) {
    return (
      <View
        style={{
          backgroundColor: '#ddd',
          width: (width * 0.92) / 2 - width * 0.02,
          marginLeft: index % 2 == 1 ? width * 0.04 : 0,
          marginTop: width * 0.04,
          padding: 10,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
        }}
      >
        <Text>
          {index === 0
            ? '1st'
            : index === 1
            ? '2nd'
            : index >= 2 && index <= 3
            ? '3-4th'
            : index >= 4 && index <= 7
            ? '5-8th'
            : index >= 8 && index <= 15
            ? '9-16th'
            : ''}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $
        </Text>
      </View>
    )
  }

  function GetTeams() {
    let arr: any = []
    players.forEach((player: any) => {
      if (!arr.includes(player.team)) {
        arr.push(player.team)
      }
    })
    return arr
  }

  async function MatchWinnerFunc(t1: any, t2: any, value: any) {
    const tournamenIndex = tournaments.findIndex(function (i) {
      return i.name === tournament.name && i.season === tournament.season
    })

    const newTournamentGrid = tournaments[tournamenIndex].grid.map(
      (i: any, indexI: number) => {
        return i.map((j: any, indexJ: number) => {
          if (indexI === gridCell.grid && indexJ === gridCell.pair) {
            return {
              ...j,
              score: `${GetMapsScore(t1, value)}-${GetMapsScore(t2, value)}`,
              winner:
                GetMapsScore(t1, value) > GetMapsScore(t2, value)
                  ? t1.name
                  : t2.name,
            }
          } else if (
            indexI === gridCell.grid + 1 &&
            indexJ === Math.floor(gridCell.pair / 2)
          ) {
            if (gridCell.pair % 2 === 0) {
              return {
                ...j,
                team1:
                  GetMapsScore(t1, value) > GetMapsScore(t2, value)
                    ? t1.name
                    : t2.name,
              }
            } else {
              return {
                ...j,
                team2:
                  GetMapsScore(t1, value) > GetMapsScore(t2, value)
                    ? t1.name
                    : t2.name,
              }
            }
          } else {
            return j
          }
        })
      }
    )

    const newTournamentData = tournaments.map((i: any, indexI: number) => {
      if (indexI === tournamenIndex) {
        setTournament({
          ...i,
          grid: newTournamentGrid,
          winner: newTournamentGrid[newTournamentGrid.length - 1].winner
            ? newTournamentGrid[newTournamentGrid.length - 1].winner === t1.name
              ? { team: t1 }
              : { team: t2 }
            : '',
        })
        return {
          ...i,
          grid: newTournamentGrid,
          winner: newTournamentGrid[newTournamentGrid.length - 1][0].winner
            ? newTournamentGrid[newTournamentGrid.length - 1][0].winner ===
              t1.name
              ? { team: t1 }
              : { team: t2 }
            : '',
        }
      } else {
        return i
      }
    })

    dispatch(updateTournaments(newTournamentData))
    await AsyncStorage.setItem('tournaments', JSON.stringify(newTournamentData))

    dispatch(
      updateTeam1({
        name: '',
        players: [{ nickName: '-', rating: 0 }],
      })
    )
    dispatch(
      updateTeam2({
        name: '',
        players: [{ nickName: '-', rating: 0 }],
      })
    )
    dispatch(clearLog())
  }

  async function StartTheTournament() {
    const teamAmount = GetTeams().length
    const shufffledTeams = ShuffleTeams(GetTeams())

    const gridLevels = Math.log2(teamAmount)
    let gridArr: any = []
    for (let i = 0; i < gridLevels; i++) {
      let levelArr = []

      for (let j = 0; j < 2 ** (gridLevels - i) / 2; j++) {
        if (i === 0) {
          levelArr.push({
            team1: shufffledTeams[j * 2],
            team2: shufffledTeams[j * 2 + 1],
            score: '',
            winner: '',
          })
        } else {
          levelArr.push({ team1: '', team2: '', score: '', winner: '' })
        }
      }
      gridArr.push(levelArr)
    }
    const newTournamentsArr = tournaments.map((i: any) => {
      if (i.name === tournament.name && i.season === tournament.season) {
        setTournament({
          ...i,
          grid: gridArr,
        })
        return {
          ...i,
          grid: gridArr,
        }
      } else {
        return i
      }
    })
    dispatch(updateTournaments(newTournamentsArr))
    await AsyncStorage.setItem('tournaments', JSON.stringify(newTournamentsArr))
  }

  function StartGamePair(pair: any) {
    const t1: Team = {
      team: {
        name: pair.team1 as string,
        motivation:
          players
            .filter((player: any) => player.team === pair.team1)
            .reduce((a, b) => a + b.motivation, 0) / 5,
        tactic:
          players
            .filter((player: any) => player.team === pair.team1)
            .reduce((a, b) => a + b.tactic, 0) / 5,
        experience:
          players
            .filter((player: any) => player.team === pair.team1)
            .reduce((a, b) => a + b.experience, 0) / 5,
        economics: 0.5,
        players: players.filter((player: any) => player.team === pair.team1),
      },
    }
    const t2: Team = {
      team: {
        name: pair.team2 as string,
        motivation:
          players
            .filter((player: any) => player.team === pair.team2)
            .reduce((a, b) => a + b.motivation, 0) / 5,
        tactic:
          players
            .filter((player: any) => player.team === pair.team2)
            .reduce((a, b) => a + b.tactic, 0) / 5,
        experience:
          players
            .filter((player: any) => player.team === pair.team2)
            .reduce((a, b) => a + b.experience, 0) / 5,
        economics: 0.5,
        players: players.filter((player: any) => player.team === pair.team2),
      },
    }
    dispatch(clearLog())
    dispatch(updateTeam1(t1.team))
    dispatch(updateTeam2(t2.team))
    setGameScreen(true)
  }

  function ShuffleTeams(teamsArr: any) {
    const shuffledArray = [...teamsArr]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]
    }
    return shuffledArray
  }

  function TournamentGrid() {
    const showGrid = (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '92%',
          marginBottom: 40,
        }}
      >
        {tournament.grid ? (
          tournament.grid.map((grid: any, indexI: number) => (
            <View
              key={indexI}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                flex: 1,
                // width: '10%',
              }}
            >
              {grid.map((pair: any, indexJ: number) => (
                <View
                  key={indexJ}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 5,
                    width: '90%',
                    padding: 5,
                    marginVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      opacity:
                        pair.score.length && pair.winner === pair.team2
                          ? 0.3
                          : 1,
                    }}
                  >
                    {pair.score
                      ? pair.score.split('-')[0]
                      : GetScore(pair.team1, log)}{' '}
                    | {pair.team1}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: '#eee',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      opacity:
                        pair.score.length && pair.winner === pair.team1
                          ? 0.3
                          : 1,
                    }}
                  >
                    {pair.score
                      ? pair.score.split('-')[1]
                      : GetScore(pair.team1, log)}{' '}
                    | {pair.team2}
                  </Text>
                  {pair.team1 && pair.team2 && !pair.score ? (
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        width: '100%',
                        borderRadius: 5,
                        backgroundColor: '#9dbef2',
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        setGridCell({ grid: indexI, pair: indexJ })
                        if (log.length) {
                          setGameScreen(true)
                        } else {
                          StartGamePair(pair)
                        }
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>Start</Text>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>
              ))}
            </View>
          ))
        ) : (
          <></>
        )}
      </View>
    )

    const tournamenIndex = tournaments.findIndex(function (i) {
      return i.name === tournament.name && i.season === tournament.season
    })

    const canStartTournament: boolean =
      tournamenIndex === 0 || tournaments[tournamenIndex - 1].winner
        ? true
        : false

    const makeGrid = (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#9dbef2',
          width: '92%',
          padding: 10,
          borderRadius: 5,
        }}
        activeOpacity={0.8}
        onPress={StartTheTournament}
      >
        <Text style={{ fontSize: 20 }}>Start the tournament</Text>
      </TouchableOpacity>
    )

    const warning = (
      <Text
        style={{
          alignSelf: 'flex-start',
          marginLeft: width * 0.04,
          color: '#a89518',
        }}
      >
        You cannot start this tournament unless you finished the previous
      </Text>
    )

    return (
      <>
        {tournament.grid ? showGrid : canStartTournament ? makeGrid : warning}
      </>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.tournamentName}>{tournament.name}</Text>
        <CupsBig cup={tournament.cup} />
        <Text style={styles.tournamentDescription}>
          {tournament.description}
        </Text>
        <TouchableOpacity
          style={styles.readMoreButton}
          activeOpacity={0.8}
          onPress={() => setGrandSlamModal(true)}
        >
          <Text style={styles.readMore}>Read more about Grand Slam</Text>
          <Ionicons name="open-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.prizeDistribution}>Prize distribution</Text>

        <FlatList
          style={{ width: '92%', marginBottom: 20 }}
          data={tournament.prizes}
          renderItem={RenderBigPrizes}
          numColumns={2}
          scrollEnabled={false}
        />
        <GrandSlamModal
          visible={grandSlamModal}
          onClose={() => setGrandSlamModal(false)}
        />
        <TournamentGrid />
      </View>
      <Modal visible={gameScreen}>
        <Main
          onClose={() => setGameScreen(false)}
          onWinners={(t1: any, t2: any, value: any) => {
            setGameScreen(false)
            MatchWinnerFunc(t1, t2, value)
          }}
        />
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
  },
  tournamentName: { fontSize: 30, fontWeight: '500', marginBottom: 20 },
  tournamentDescription: {
    fontSize: 18,
    width: '92%',
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginLeft: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  readMore: { fontSize: 18, marginRight: 5 },
  prizeDistribution: {
    fontSize: 18,
    textAlign: 'left',
    width: '92%',
    marginTop: width * 0.04,
  },
})
