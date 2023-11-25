import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import TeamsBig from '../components/TeamBig'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GetSortedPlayersByRating } from '../functions/functions'
import { Ionicons } from '@expo/vector-icons'
import PlayerStatSegments from '../components/PlayerStatSegments'
import Cups from '../components/Cups'
import Teams from '../components/Teams'

export default function PlayerInfoScreen({ navigation, route }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  const [playerInfo, setPlayerInfo] = useState<any>(route.params.player)

  function PlayerPriceKoef(rating: number) {
    const topPercent =
      (players.length -
        GetSortedPlayersByRating(players).findIndex(
          (i: any) => i.rating === rating
        )) /
      players.length

    return 1 + 4 * topPercent
  }

  function PlayerPriceAmount(rating: number) {
    const price =
      (rating -
        GetSortedPlayersByRating(players)[players.length - 1].rating * 0.8) *
      500000

    return price
  }

  function RenderTrophies({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('TournamentInfoScreen', { tournament: item })
        }}
        style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}
      >
        <Cups cup={item.cup} />
        <Text>Season {item.season}</Text>
      </TouchableOpacity>
    )
  }

  function RenderPlayersTeam({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setPlayerInfo(item)
        }}
        style={[
          styles.playerBlock,
          { backgroundColor: index % 2 === 0 ? '#fff' : '#eee' },
        ]}
      >
        <Text style={styles.playerPosition}>{index + 1}</Text>
        <Text style={styles.playerName}>{item.nickName}</Text>
        <Text style={styles.playerRating}>{item.rating}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
      </TouchableOpacity>
    )
  }

  function TeamInfo() {
    return (
      <>
        <Text style={styles.modalPlayerName}>{playerInfo.team}</Text>
        <TeamsBig team={playerInfo.team} />
        <FlatList
          style={{ width: '92%', marginTop: 10 }}
          data={GetSortedPlayersByRating(players).filter(
            (player: any) => player.team === playerInfo.team
          )}
          renderItem={RenderPlayersTeam}
          scrollEnabled={false}
        />

        {tournaments.filter(
          (i: any) => i.winner && i.winner.team.name === playerInfo.team
        ).length ? (
          <>
            <Text
              style={{
                width: '100%',
                paddingLeft: '4%',
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                padding: 5,
                marginTop: 5,
              }}
            >
              Team's rophies:
            </Text>
            <FlatList
              style={{ width: '100%', backgroundColor: '#fff' }}
              horizontal
              data={tournaments.filter(
                (i: any) => i.winner && i.winner.team.name === playerInfo.team
              )}
              renderItem={RenderTrophies}
            />
          </>
        ) : (
          <Text
            style={{
              width: '100%',
              paddingLeft: '4%',
              backgroundColor: '#fff',
              marginTop: 5,
              padding: 5,
            }}
          >
            No trophies yet
          </Text>
        )}
      </>
    )
  }

  function PlayerInfo() {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Text style={styles.modalPlayerTitle}>{playerInfo.nickName}</Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '92%',
            marginTop: 10,
            alignSelf: 'center',
          }}
        >
          <Text style={styles.modalPlayerInfo}>Team: {playerInfo.team}</Text>
          <Text style={styles.modalPlayerInfo}>
            Rating: {playerInfo.rating}
          </Text>
          <PlayerStatSegments rating={playerInfo.rating} />

          <Text style={styles.modalPlayerInfo}>Role: {playerInfo.role}</Text>
          <Text style={styles.modalPlayerInfo}>
            Price:{' '}
            {(
              PlayerPriceAmount(playerInfo.rating) *
              PlayerPriceKoef(playerInfo.rating)
            )
              .toFixed()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
            $
          </Text>
        </View>

        {tournaments.filter(
          (i: any) =>
            i.winner &&
            i.winner.team.name === playerInfo.team &&
            i.winner.team.players.find(
              (i: any) => i.nickName === playerInfo.nickName
            )
        ).length ? (
          <>
            <Text
              style={{
                width: '100%',
                paddingLeft: '4%',
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                padding: 5,
              }}
            >
              Player's rophies:
            </Text>
            <FlatList
              style={{ width: '100%', backgroundColor: '#fff' }}
              horizontal
              data={tournaments.filter(
                (i: any) =>
                  i.winner &&
                  i.winner.team.name === playerInfo.team &&
                  i.winner.team.players.find(
                    (i: any) => i.nickName === playerInfo.nickName
                  )
              )}
              renderItem={RenderTrophies}
            />
          </>
        ) : (
          <Text
            style={{
              width: '100%',
              paddingLeft: '4%',
              backgroundColor: '#fff',

              padding: 5,
            }}
          >
            No trophies yet
          </Text>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Ionicons name="chevron-back" size={36} color="black" />
        </TouchableOpacity>
        <PlayerInfo />
        <TeamInfo />
      </View>
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
  playerBlock: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  playerPosition: { width: '7%', fontSize: 16, fontWeight: '500' },
  playerName: { width: '30%', fontSize: 18 },
  playerRating: { width: '13%', fontSize: 16 },
  playerRole: { width: '20%', fontSize: 16, fontWeight: '300' },
  playerTeam: { width: '30%', fontSize: 16 },
  modalPlayerTitle: {
    fontSize: 30,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  modalPlayerInfo: {
    fontSize: 24,
  },
  modalPlayerName: {
    fontSize: 30,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
