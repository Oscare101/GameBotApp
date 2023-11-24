import { useState } from 'react'
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Teams from '../components/Teams'
import TeamsBig from '../components/TeamBig'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import Cups from '../components/Cups'

export default function PlayersScreen({ navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  const [modalPLayer, setModalPLayer] = useState<any>('')
  const [teamInfo, setTeamInfo] = useState<boolean>(false)

  function RenderPlayer({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setModalPLayer(item)
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
        <Teams team={item.team} />
        <Text style={styles.playerTeam}> {item.team}</Text>
      </TouchableOpacity>
    )
  }

  function PlayerPriceKoef(rating: number) {
    const topPercent =
      (players.length -
        GetSortedPlayersByRating().findIndex((i: any) => i.rating === rating)) /
      players.length

    return 1 + 4 * topPercent
  }

  function PlayerPriceAmount(rating: number) {
    const price =
      (rating - GetSortedPlayersByRating()[players.length - 1].rating * 0.8) *
      500000

    return price
  }

  function GetSortedPlayersByRating() {
    let arr: any = []
    players.forEach((i: any) => {
      arr.push(i)
    })
    arr.sort((a: any, b: any) => b.rating - a.rating)
    return arr
  }

  function RenderTrophies({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setModalPLayer(false)
          setTeamInfo(false)
          navigation.navigate('TournamentInfoScreen', { tournament: item })
        }}
      >
        <Cups cup={item.cup} />
      </TouchableOpacity>
    )
  }

  function RenderPlayersTeam({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setModalPLayer(item)
          setTeamInfo(false)
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

  function PlayerInfo() {
    return (
      <>
        <TouchableOpacity
          style={styles.exitButton}
          activeOpacity={0.8}
          onPress={() => setModalPLayer(false)}
        >
          <Ionicons name="close-outline" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalPlayerName}>{modalPLayer.nickName}</Text>
        <TeamsBig team={modalPLayer.team} />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '92%',
            marginTop: 10,
          }}
        >
          <Text style={styles.modalPlayerInfo}>
            Team: {modalPLayer.team}{' '}
            <Ionicons
              name="open-outline"
              size={24}
              color="black"
              onPress={() => setTeamInfo(true)}
            />
          </Text>
          <Text style={styles.modalPlayerInfo}>
            Rating: {modalPLayer.rating}
          </Text>
          <View
            style={{
              height: 10,
              width: 110,
              backgroundColor: '#eee',
              flexDirection: 'row',
              marginVertical: 10,
            }}
          >
            <View
              style={{
                height: '100%',
                width: '33.33%',
                backgroundColor: '#d94848',
              }}
            />
            <View
              style={{
                height: '100%',
                width: '33.33%',
                backgroundColor: '#e8e05f',
              }}
            />
            <View
              style={{
                height: '100%',
                width: '33.33%',
                backgroundColor: '#45c454',
              }}
            />
            <View
              style={{
                height: 30,
                width: 10,
                top: -10,
                // TODO FIX THIS SHIT
                left:
                  (100 *
                    (players.length -
                      GetSortedPlayersByRating().findIndex(
                        (i: any) => i.rating === modalPLayer.rating
                      ))) /
                  players.length,
                backgroundColor: '#00000066',
                position: 'absolute',
              }}
            />
          </View>
          <Text style={styles.modalPlayerInfo}>Role: {modalPLayer.role}</Text>
          <Text style={styles.modalPlayerInfo}>
            Price:{' '}
            {(
              PlayerPriceAmount(modalPLayer.rating) *
              PlayerPriceKoef(modalPLayer.rating)
            )
              .toFixed()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
            $
          </Text>
        </View>
        <Text>Trophies</Text>
        <FlatList
          horizontal
          data={tournaments.filter(
            (i: any) =>
              i.winner &&
              i.winner.team.name === modalPLayer.team &&
              i.winner.team.players.find(
                (i: any) => i.nickName === modalPLayer.nickName
              )
          )}
          renderItem={RenderTrophies}
        />
      </>
    )
  }

  function TeamInfo() {
    return (
      <>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => setTeamInfo(false)}
        >
          <Ionicons name="chevron-back" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.modalPlayerName}>{modalPLayer.team}</Text>
        <TeamsBig team={modalPLayer.team} />
        <FlatList
          style={{ width: '92%', marginTop: 10 }}
          data={GetSortedPlayersByRating().filter(
            (player: any) => player.team === modalPLayer.team
          )}
          renderItem={RenderPlayersTeam}
        />
        <Text>Trophies</Text>
        <FlatList
          horizontal
          data={tournaments.filter(
            (i: any) => i.winner && i.winner.team.name === modalPLayer.team
          )}
          renderItem={RenderTrophies}
        />
      </>
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
      <FlatList
        style={{ width: '92%' }}
        data={GetSortedPlayersByRating()}
        renderItem={RenderPlayer}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={modalPLayer && !!modalPLayer.nickName}
        transparent
        style={styles.modal}
      >
        <View
          // activeOpacity={1}
          // onPress={() => {
          //   setTeamInfo(false)
          //   setModalPLayer(false)
          // }}
          style={styles.modalView}
        >
          <View style={styles.modalBlock}>
            {teamInfo ? <TeamInfo /> : <PlayerInfo />}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
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
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalView: {
    backgroundColor: '#00000022',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBlock: {
    backgroundColor: '#fff',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: '10%',
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPlayerName: {
    fontSize: 30,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalPlayerInfo: {
    fontSize: 20,
  },
})
