import React, { useDebugValue } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import rules from '../constants/rules'
import {
  GetPracticeCost,
  GetTeamExperience,
  GetTeamMotivation,
  GetTeamPlayersRating,
  GetTeamPrizes,
  GetTeamTactic,
  PlayerPriceAmount,
} from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GameInfo, Player } from '../constants/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updatePlayers } from '../redux/players'
import { updateGameInfo } from '../redux/gameInfo'

export default function UpgradeTeamModal(props: any) {
  const players = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)
  const gameInfo = useSelector((state: RootState) => state.gameInfo)
  const dispatch = useDispatch()

  async function UpgradeTeam() {
    const team = props.data
    let newPlayersArr = players.map((p: Player) => {
      if (p.team === team) {
        const random = Math.random()
        if (random < 0.33 && p.motivation + 0.01 <= 1) {
          return { ...p, motivation: p.motivation + 0.01 }
        } else if (random > 0.66 && p.tactic + 0.01 <= 1) {
          return { ...p, tactic: p.tactic + 0.01 }
        } else if (p.experience + 0.01 <= 1) {
          return { ...p, experience: p.experience + 0.01 }
        } else {
          return p
        }
      } else {
        return p
      }
    })

    const newGameInfo: GameInfo = {
      ...gameInfo,
      expences: gameInfo.expences + +GetPracticeCost(players, props.data),
    }
    dispatch(updatePlayers(newPlayersArr))
    await AsyncStorage.setItem('players', JSON.stringify(newPlayersArr))
    dispatch(updateGameInfo(newGameInfo))
    await AsyncStorage.setItem('gameInfo', JSON.stringify(newGameInfo))
  }

  return (
    <Modal visible={!!props.data} transparent={true} style={styles.modal}>
      <StatusBar
        // barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={'#bbb'}
      />
      <View style={styles.modalBG}>
        <View style={styles.modalBlock}>
          <TouchableOpacity
            style={styles.exitButton}
            activeOpacity={0.8}
            onPress={() => props.onClose()}
          >
            <Ionicons name="close-outline" size={36} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Team info {props.data}</Text>

          <Text style={styles.description}>
            Each player has 3 hidden parameters:{' '}
            <Text style={styles.motivation}>motivation</Text>,{' '}
            <Text style={styles.tactic}>tactics</Text> and{' '}
            <Text style={styles.experience}>experience</Text>
          </Text>
          <Text style={styles.description}>
            Here is the average of all the players on your team, if the maximum,
            then each will bring a 5% more chance to win
          </Text>
          <View
            style={{
              height: 10,
              width: '50%',
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#eee',
              alignSelf: 'flex-start',
              margin: '4%',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: '#0a701f',
                width: `${GetTeamMotivation(players, props.data) * 100}%`,
              }}
            ></View>
          </View>
          <View
            style={{
              height: 10,
              width: '50%',
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#eee',
              alignSelf: 'flex-start',
              margin: '4%',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: '#b5880b',
                width: `${GetTeamTactic(players, props.data) * 100}%`,
              }}
            ></View>
          </View>
          <View
            style={{
              height: 10,
              width: '50%',
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#eee',
              alignSelf: 'flex-start',
              margin: '4%',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: '#bd0f9a',
                width: `${GetTeamExperience(players, props.data) * 100}%`,
              }}
            ></View>
          </View>
          <Text style={styles.description}>
            You can practice with the team and then these parameters will
            increase. One practice - one random parameter will grow by 1% in
            each of the players
          </Text>
          <Text style={styles.description}>
            You can practice with the team and then these parameters will
            increase. One practice - one random parameter will grow by 1%. The
            cost of practice is determined by the rank of your players and the
            already available size of the parameters
          </Text>
          <Text style={styles.description}>
            prizes - expenses = <Text style={styles.bold}>cash</Text>
            {'\n'}
            {GetTeamPrizes(tournaments, players, props.data)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
            -{' '}
            {gameInfo.expences.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
            ={' '}
            <Text style={styles.bold}>
              {(
                GetTeamPrizes(tournaments, players, props.data) -
                gameInfo.expences
              )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
              $
            </Text>
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              UpgradeTeam()
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: '#9dbef2',
              borderRadius: 10,
              width: '92%',
              opacity:
                GetTeamPrizes(tournaments, players, props.data) -
                  (gameInfo.expences + +GetPracticeCost(players, props.data)) <
                0
                  ? 0.8
                  : 1,
            }}
            disabled={
              GetTeamPrizes(tournaments, players, props.data) -
                (gameInfo.expences + +GetPracticeCost(players, props.data)) <
              0
            }
          >
            <Text style={{ fontSize: 28, color: '#fff' }}>Practice</Text>
            <Text style={{ fontSize: 18, color: '#fff' }}>
              cost -{' '}
              {GetPracticeCost(players, props.data).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ' '
              )}{' '}
              $
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBG: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66666666',
  },
  modalBlock: {
    width: '90%',
    paddingVertical: '4%',

    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    width: '92%',
    marginBottom: 10,
  },
  rating: {
    fontWeight: '500',
    color: '#ad0202',
  },
  economy: { fontWeight: '500', color: '#002cb0' },
  motivation: { fontWeight: '500', color: '#0a701f' },
  tactic: { fontWeight: '500', color: '#b5880b' },
  experience: { fontWeight: '500', color: '#bd0f9a' },
  bold: { fontWeight: '600' },
})
