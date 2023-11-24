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
import players from '../constants/players'
import { Ionicons } from '@expo/vector-icons'
import Teams from '../components/Teams'
import TeamsBig from '../components/TeamBig'

export default function PlayersScreen() {
  const [modalPLayer, setModalPLayer] = useState<any>('')

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
        players
          .sort((a, b) => b.rating - a.rating)
          .findIndex((i: any) => i.rating === rating)) /
      players.length

    return 1 + 4 * topPercent
  }

  function PlayerPriceAmount(rating: number) {
    const price =
      (rating -
        players.sort((a, b) => b.rating - a.rating)[players.length - 1].rating *
          0.8) *
      500000

    return price
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
        data={players.sort((a, b) => b.rating - a.rating)}
        renderItem={RenderPlayer}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={modalPLayer && !!modalPLayer.name}
        transparent
        style={styles.modal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalBlock}>
            <TouchableOpacity
              style={styles.exitButton}
              activeOpacity={0.8}
              onPress={() => setModalPLayer(false)}
            >
              <Ionicons name="close-outline" size={36} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalPlayerName}>{modalPLayer.name}</Text>
            <TeamsBig team={modalPLayer.team} />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '92%',
              }}
            >
              <Text style={styles.modalPlayerInfo}>
                Team: {modalPLayer.team}
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
                          players
                            .sort((a, b) => b.rating - a.rating)
                            .findIndex(
                              (i: any) => i.rating === modalPLayer.rating
                            ))) /
                      players.length,
                    backgroundColor: '#00000066',
                    position: 'absolute',
                  }}
                />
              </View>
              <Text style={styles.modalPlayerInfo}>
                Role: {modalPLayer.role}
              </Text>
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
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
