import { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  GetTeamPoints,
  GetTeamPointsLast7Tournaments,
  GetTeamPrizes,
  GetTeamWinRate,
  GetTeams,
  GetTeamsInPlaces,
} from '../functions/functions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import rules from '../constants/rules'
import Teams from '../components/Teams'
import TeamsBig from '../components/TeamBig'
import TeamsHeader from '../components/TeamsHeader'

export default function TeamsScreen({ navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  const [sortBy, setSortBy] = useState<string>('RatingYearly') // WinRate RatingTotal Prize

  function GetTeamsData() {
    const teamsData: any = []
    GetTeams(players).forEach((team: string) => {
      teamsData.push({
        name: team,
        prizes: GetTeamPrizes(tournaments, players, team),
        points: GetTeamPoints(tournaments, players, team),
        lastYearPoints: GetTeamPointsLast7Tournaments(
          tournaments,
          players,
          team
        ),
        winRate: GetTeamWinRate(tournaments, team),
      })
    })

    return teamsData
  }

  function GetTeamSortedByRatingYearly() {
    return GetTeamsData().sort(
      (a: any, b: any) => b.lastYearPoints - a.lastYearPoints
    )
  }

  function GetTeamSortedByPrizes() {
    return GetTeamsData().sort((a: any, b: any) => b.prizes - a.prizes)
  }

  function GetTeamSortedByWinRate() {
    return GetTeamsData().sort((a: any, b: any) => b.winRate - a.winRate)
  }

  function RenderTeams({ item, index }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: '#fff',
          marginVertical: 5,
          borderRadius: 5,
          padding: 5,
          overflow: 'hidden',
          paddingRight: 10,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PlayerInfoScreen', {
            player: players.filter((p: any) => p.team === item.name)[0],
          })
        }}
      >
        <Text style={styles.position}>{index + 1}</Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Teams team={item.name} />
            <Text style={styles.teamName}>{item.name}</Text>

            <Text
              style={[
                styles.points,
                { fontWeight: sortBy === 'RatingYearly' ? '500' : '400' },
              ]}
            >
              points {item.lastYearPoints}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <View style={styles.rowStart}>
              <Text
                style={[
                  styles.teamStatTitle,
                  { fontWeight: sortBy === 'Prizes' ? '500' : '400' },
                ]}
              >
                Total prizes won:{' '}
                {item.prizes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} $
              </Text>
            </View>

            <View style={styles.teamStatSeparator} />
            <View style={styles.rowStart}>
              <Text
                style={[
                  styles.teamStatTitle,
                  { fontWeight: sortBy === 'WinRate' ? '500' : '400' },
                ]}
              >
                Win rate: {item.winRate} %
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <TeamsHeader
        sortBy={sortBy}
        setSortBy={(value: string) => setSortBy(value)}
      />
      <FlatList
        style={{ width: '92%' }}
        data={
          sortBy === 'RatingYearly'
            ? GetTeamSortedByRatingYearly()
            : sortBy === 'Prizes'
            ? GetTeamSortedByPrizes()
            : GetTeamSortedByWinRate()
        }
        renderItem={RenderTeams}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  position: {
    fontSize: 24,
    fontWeight: '900',
    marginRight: 5,
    opacity: 0.3,
    width: 28,

    textAlign: 'center',
  },
  points: {
    fontSize: 16,
  },
  teamName: { fontSize: 20, flex: 1, textAlign: 'left', paddingLeft: 10 },
  teamStatBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '92%',
    marginVertical: 5,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  teamStatTitle: {
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  teamStatValue: {
    fontSize: 18,
    fontWeight: '500',
  },
  teamStatSeparator: { width: 1, height: '100%', backgroundColor: '#aaa' },
})
