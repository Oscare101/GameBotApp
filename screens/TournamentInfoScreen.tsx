import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
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
import { Player, Team, Tournament } from '../constants/interfaces'
import team1, { updateTeam1 } from '../redux/team1'
import team2, { updateTeam2 } from '../redux/team2'
import {
  ExperienceChange,
  GetMapsScore,
  GetScore,
  GetSortedPlayersByRating,
  GetTeams,
  InstantGame,
  MotivationChange,
  RatingChange,
  ShuffleTeams,
  TacticChange,
} from '../functions/functions'
import Main from './Main'
import { clearLog } from '../redux/logs'
import TeamsBig from '../components/TeamBig'
import ExplainGrid from '../components/ExplainGrid'
import ExplainingModal from '../components/ExplainingModal'
import { updatePlayers } from '../redux/players'
import InstantModal from '../components/InstantModal'

const width = Dimensions.get('screen').width

export default function TournamentInfoScreen({ route, navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)
  const log = useSelector((state: RootState) => state.log)
  const team1 = useSelector((state: RootState) => state.team1.team)
  const team2 = useSelector((state: RootState) => state.team2.team)
  const dispatch = useDispatch()

  const [tournament, setTournament] = useState<Tournament>(
    route.params.tournament
  )
  const [gameScreen, setGameScreen] = useState<boolean>(false)
  const [gridCell, setGridCell] = useState<any>(null)
  const [grandSlamModal, setGrandSlamModal] = useState<boolean>(false)
  const [instantModal, setInstantModal] = useState<boolean>(false)

  function GetTeamsInPlaces() {
    let teamsArr: any = []
    if (tournament.grid) {
      for (let i = tournament.grid.length - 1; i >= 0; i--) {
        tournament.grid[i].forEach((pair: any) => {
          if (!teamsArr.includes(pair.winner)) {
            teamsArr.push(pair.winner)
          }
        })
      }
      GetTeams(players).forEach((team: any) => {
        if (!teamsArr.includes(team)) {
          teamsArr.push(team)
        }
      })
      return teamsArr
    } else {
      return []
    }
  }

  function RenderBigPrizes({ item, index }: any) {
    // const teamPlaces = GetTeamsInPlaces()

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
          overflow: 'hidden',
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
        {tournament.winner ? (
          <>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              {GetTeamsInPlaces()[index]}
            </Text>
            <View style={{ position: 'absolute', zIndex: -1, opacity: 0.1 }}>
              <TeamsBig team={GetTeamsInPlaces()[index]} />
            </View>
          </>
        ) : (
          <></>
        )}
        <Text style={{ fontSize: 20 }}>
          {item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $
        </Text>
      </View>
    )
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
          winner: newTournamentGrid[newTournamentGrid.length - 1][0].winner
            ? newTournamentGrid[newTournamentGrid.length - 1][0].winner ===
              t1.name
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

  async function StartTheTournament() {
    const teamAmount = GetTeams(players).length
    const shufffledTeams = ShuffleTeams(GetTeams(players))

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
  }

  function TournamentGrid() {
    const showGrid = (
      <>
        <ExplainGrid />
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
                      <View style={styles.gridButtonBlock}>
                        <TouchableOpacity
                          style={[
                            styles.gridButton,
                            { backgroundColor: '#9dbef2' },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            setGridCell({ grid: indexI, pair: indexJ })
                            if (log.length) {
                              setGameScreen(true)
                            } else {
                              StartGamePair(pair)
                              setGameScreen(true)
                            }
                          }}
                        >
                          <Ionicons
                            name="ios-play-outline"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.gridButton,
                            { backgroundColor: '#95deaf' },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            setGridCell({
                              grid: indexI,
                              pair: indexJ,
                            })

                            StartGamePair(pair)
                            setInstantModal(true)
                          }}
                        >
                          <Ionicons
                            name="timer-outline"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
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
      </>
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
        {tournament.grid.length
          ? showGrid
          : canStartTournament
          ? makeGrid
          : warning}
      </>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />

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
      <InstantModal
        visible={instantModal}
        onClose={() => {
          setInstantModal(false)
        }}
        onSuccess={() => {
          const instantWinnersArr = InstantGame(team1, team2)

          MatchWinnerFunc(team1, team2, instantWinnersArr)
          AfterMatchPlayersDinamics(instantWinnersArr)
          setInstantModal(false)
        }}
      />
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
  gridButtonBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridButton: {
    padding: 5,
    width: '48%',
    borderRadius: 5,

    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
