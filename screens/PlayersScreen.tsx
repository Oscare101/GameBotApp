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
import Teams from '../components/Teams'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import {
  GetSortedPlayersByNickNames,
  GetSortedPlayersByRating,
  GetSortedPlayersByRoles,
  GetSortedPlayersByTeams,
} from '../functions/functions'
import PlayersHeader from '../components/PlayersHeader'

export default function PlayersScreen({ navigation }: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)

  const [sortBy, setSortBy] = useState<string>('Rating') // Teams Role NickName

  function RenderPlayer({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PlayerInfoScreen', { player: item })
        }}
        style={[
          styles.playerBlock,
          { backgroundColor: index % 2 === 0 ? '#fff' : '#eee' },
        ]}
      >
        <Text style={styles.playerPosition}>
          {sortBy === 'Team' ? Math.ceil((index + 1) / 5) : index + 1}
        </Text>
        <Text style={styles.playerName}>{item.nickName}</Text>
        <Text style={styles.playerRating}>{item.rating}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
        <Teams team={item.team} />
        <Text style={styles.playerTeam}> {item.team}</Text>
      </TouchableOpacity>
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
      <PlayersHeader
        sortBy={sortBy}
        setSortBy={(value: string) => setSortBy(value)}
      />
      <FlatList
        style={{ width: '92%' }}
        data={
          sortBy === 'Rating'
            ? GetSortedPlayersByRating(players)
            : sortBy === 'Team'
            ? GetSortedPlayersByTeams(players)
            : sortBy === 'NickName'
            ? GetSortedPlayersByNickNames(players)
            : GetSortedPlayersByRoles(players)
        }
        renderItem={RenderPlayer}
        showsVerticalScrollIndicator={false}
      />
      {/* <Modal
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
      </Modal> */}
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
