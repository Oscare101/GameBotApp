import React, { useDebugValue, useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import rules from '../constants/rules'
import {
  GetSortedPlayersByRating,
  GetTeamExperience,
  GetTeamMotivation,
  GetTeamPlayersRating,
  GetTeamPrizes,
  GetTeamTactic,
  PlayerPriceAmount,
  PlayerPriceKoef,
} from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GameInfo, Player, Tournament } from '../constants/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updatePlayers } from '../redux/players'
import { updateGameInfo } from '../redux/gameInfo'

export default function ReshuffleTeamModal(props: any) {
  const players: any = useSelector((state: RootState) => state.players)
  const tournaments = useSelector((state: RootState) => state.tournaments)
  const gameInfo = useSelector((state: RootState) => state.gameInfo)
  const dispatch = useDispatch()
  const [buyPlayer, setBuyPlayer] = useState<string>('')
  const [tradePlayer, setTradePlayer] = useState<string>('')

  async function Reshuffle() {
    let newPlayersArr = players.map((p: Player) => {
      if (p.nickName === buyPlayer) {
        return {
          ...p,
          team: gameInfo.team,
        }
      } else if (p.nickName === tradePlayer) {
        return {
          ...p,
          team: props.data,
        }
      } else {
        return p
      }
    })

    const newGameInfo: GameInfo = {
      ...gameInfo,
      expences: gameInfo.expences + ReshufflePrice(),
    }
    dispatch(updatePlayers(newPlayersArr))
    await AsyncStorage.setItem('players', JSON.stringify(newPlayersArr))
    dispatch(updateGameInfo(newGameInfo))
    await AsyncStorage.setItem('gameInfo', JSON.stringify(newGameInfo))
  }

  function RenderPlayersTeam({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setBuyPlayer(item.nickName)
          // setPlayerInfo(item)
        }}
        style={[
          styles.playerBlock,
          { backgroundColor: index % 2 === 0 ? '#fff' : '#eee' },
        ]}
      >
        <Text style={styles.playerName}>{item.nickName}</Text>
        <Text style={styles.playerRating}>{item.rating}</Text>

        <Text style={styles.playerRole}>{item.role}</Text>
        <Text style={styles.playerPrice}>
          {(
            PlayerPriceAmount(players, item.rating) *
            PlayerPriceKoef(players, item.rating) *
            2
          )
            .toFixed()

            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
          $
        </Text>
      </TouchableOpacity>
    )
  }

  function RenderPlayersMyTeam({ item, index }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setTradePlayer(item.nickName)
          // setPlayerInfo(item)
        }}
        style={[
          styles.playerBlock,
          {
            backgroundColor:
              tradePlayer === item.nickName
                ? '#9dbef2'
                : index % 2 === 0
                ? '#fff'
                : '#eee',
          },
        ]}
      >
        <Text style={styles.playerPosition}>{index + 1}</Text>
        <Text style={styles.playerName}>{item.nickName}</Text>
        <Text style={styles.playerRating}>{item.rating}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
      </TouchableOpacity>
    )
  }

  function ReshufflePrice() {
    let price = 0
    if (buyPlayer) {
      price =
        PlayerPriceAmount(
          players,
          players.find((p: Player) => p.nickName === buyPlayer).rating
        ) *
        PlayerPriceKoef(
          players,
          players.find((p: Player) => p.nickName === buyPlayer).rating
        ) *
        2
    }

    return Math.floor(price)
  }

  const yourCash = (
    <Text style={styles.description}>
      Your cash ={' '}
      <Text style={styles.bold}>
        {(
          GetTeamPrizes(tournaments, players, gameInfo.team) - gameInfo.expences
        )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
        $
      </Text>
    </Text>
  )

  const reshuffleInfo = (
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
          You can buy players from other teams
        </Text>
        <Text style={styles.description}>
          In case of buying one of the players of this team, you will have to
          pay his price + the value of the player's contract, the more
          successful the team, the more expensive the contracts
        </Text>
        <Text style={styles.description}>
          Along with that, you will have to give one of your players to that
          team, so to speak trade
        </Text>
        <Text style={styles.description}>Choose any:</Text>
        <FlatList
          style={{ width: '92%', marginTop: 10 }}
          data={GetSortedPlayersByRating(players).filter(
            (player: any) => player.team === props.data
          )}
          renderItem={RenderPlayersTeam}
        />
        {yourCash}
      </View>
    </View>
  )

  const buyInfo = (
    <View style={styles.modalBG}>
      <View style={styles.modalBlock}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => {
            setBuyPlayer('')

            setTradePlayer('')
          }}
        >
          <Ionicons name="arrow-back-outline" size={36} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{buyPlayer}</Text>
        <Text style={styles.description}>
          Now choose the player you want to trade
        </Text>
        <FlatList
          style={{ width: '92%', marginTop: 10 }}
          data={GetSortedPlayersByRating(players).filter(
            (player: any) => player.team === gameInfo.team
          )}
          renderItem={RenderPlayersMyTeam}
        />
        {buyPlayer ? (
          <View
            style={{
              width: '92%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 30,
            }}
          >
            <View
              style={[
                styles.playerBlock,
                {
                  backgroundColor: '#eee',
                },
              ]}
            >
              <Text style={styles.playerName}>{buyPlayer}</Text>
              <Text style={styles.playerRating}>
                {players.find((p: Player) => p.nickName === buyPlayer).rating ||
                  ''}
              </Text>
              <Text style={styles.playerRole}>
                {players.find((p: Player) => p.nickName === buyPlayer).role ||
                  ''}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="black" />
            {tradePlayer ? (
              <View
                style={[
                  styles.playerBlock,
                  {
                    backgroundColor: '#eee',
                  },
                ]}
              >
                <Text style={styles.playerName}>{tradePlayer}</Text>
                <Text style={styles.playerRating}>
                  {players.find((p: Player) => p.nickName === tradePlayer)
                    .rating || ''}
                </Text>
                <Text style={styles.playerRole}>
                  {players.find((p: Player) => p.nickName === tradePlayer)
                    .role || ''}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.playerBlock,
                  {
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>?</Text>
              </View>
            )}

            <Text style={{ fontSize: 24 }}>
              +{' '}
              {ReshufflePrice()
                .toFixed()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
              $
            </Text>
          </View>
        ) : (
          <></>
        )}
        {yourCash}
        {tournaments.find((t: Tournament) => !t.winner) ? (
          <Text style={styles.error}>
            You can make reshuffles only in the off-season. When the tournament
            season has already ended, and the new one has not yet begun
          </Text>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // UpgradeTeam()
              Reshuffle()
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor:
                GetTeamPrizes(tournaments, players, gameInfo.team) -
                  (gameInfo.expences + ReshufflePrice()) <
                  0 ||
                !tradePlayer ||
                !buyPlayer
                  ? '#eee'
                  : '#9dbef2',
              borderRadius: 10,
              width: '92%',
              opacity:
                GetTeamPrizes(tournaments, players, gameInfo.team) -
                  (gameInfo.expences + ReshufflePrice()) <
                  0 ||
                !tradePlayer ||
                !buyPlayer
                  ? 0.8
                  : 1,
            }}
            disabled={
              GetTeamPrizes(tournaments, players, gameInfo.team) -
                (gameInfo.expences + ReshufflePrice()) <
                0 ||
              !tradePlayer ||
              !buyPlayer
            }
          >
            <Text style={{ fontSize: 28, color: '#fff' }}>Buy</Text>
            <Text style={{ fontSize: 18, color: '#fff' }}>
              cost -{' '}
              {ReshufflePrice()
                .toFixed()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
              $
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <Modal visible={!!props.data} transparent={true} style={styles.modal}>
      <StatusBar
        // barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={'#bbb'}
      />
      {buyPlayer ? buyInfo : reshuffleInfo}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
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

  bold: { fontWeight: '600' },
  playerBlock: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  playerPrice: { width: '30%', fontSize: 16 },

  playerPosition: { width: '7%', fontSize: 16, fontWeight: '500' },
  playerName: { width: '30%', fontSize: 18 },
  playerRating: { width: '13%', fontSize: 16 },
  playerRole: { width: '20%', fontSize: 16, fontWeight: '300' },
  playerTeam: { width: '30%', fontSize: 16 },
  error: { color: '#ad0202', width: '92%', fontSize: 18 },
})
