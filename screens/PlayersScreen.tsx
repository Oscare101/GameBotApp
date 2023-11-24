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
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerRating}>{item.rating}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
        <Text style={styles.playerTeam}>{item.team}</Text>
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
      <FlatList
        style={{ width: '92%' }}
        data={players.sort((a, b) => b.rating - a.rating)}
        renderItem={RenderPlayer}
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
            <View>
              <Text style={styles.modalPlayerInfo}>
                Team: {modalPLayer.team}
              </Text>
              <Text style={styles.modalPlayerInfo}>
                Rating: {modalPLayer.rating}
              </Text>
              <Text style={styles.modalPlayerInfo}>
                Role: {modalPLayer.role}
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
  playerPosition: { width: '10%', fontSize: 16, fontWeight: '500' },
  playerName: { width: '35%', fontSize: 18 },
  playerRating: { width: '15%', fontSize: 16 },
  playerRole: { width: '20%', fontSize: 16, fontWeight: '300' },
  playerTeam: { width: '20%', fontSize: 16 },
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
