import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import colors from '../constants/colors'
const width = Dimensions.get('window').width

export default function ExplainingModal(props: any) {
  return (
    <Modal visible={props.visible} transparent={true} style={styles.modal}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '92%',
            }}
          >
            <AntDesign name="questioncircleo" size={20} color="black" />
            <Text style={styles.question}>How matches are played?</Text>
          </View>
          <Text style={styles.description}>
            Each round consists of tacts, each tact is the activity of one of
            the players of one team, who kills one of the opponents. It is not
            difficult to calculate that the number of tacts in a roun The round
            ends when one of the teams has no players left
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '92%',
            }}
          >
            <AntDesign name="questioncircleo" size={20} color="black" />
            <Text style={styles.question}>How each tact is calculated?</Text>
          </View>
          <Text style={styles.description}>
            Each team has players, each player has{' '}
            <Text style={styles.rating}>rating</Text>, which is also then
            multiplied by factors such as{' '}
            <Text style={styles.economy}>economy</Text>,{' '}
            <Text style={styles.motivation}>motivation</Text>,{' '}
            <Text style={styles.tactic}>tactic</Text> and{' '}
            <Text style={styles.experience}>experience</Text>
          </Text>
          <Text style={styles.description}>
            • The <Text style={styles.rating}>rating</Text> changes after each
            match. randomly up and down
          </Text>
          <Text style={styles.description}>
            • The <Text style={styles.economy}>economy</Text> changes every
            round, depending on the result of which it will improve or worsen.
            {'\n'}Looks like this
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
                backgroundColor: colors.team1EconomicsColor,
                width: `${60}%`,
              }}
            ></View>
          </View>
          <Text style={styles.description}>
            • Other parameters are invisible and change in secret:{' '}
            <Text style={styles.motivation}>motivation</Text> increases if a
            team beats a stronger team than it,{' '}
            <Text style={styles.experience}>experience</Text> changes
            inconsistently regardless of success,{' '}
            <Text style={styles.tactic}>tactics</Text> are most likely to
            improve after a win and deteriorate after a loss
          </Text>
          <Text style={styles.description}>
            • The higher these indicators are, the more chances the team has to
            win
          </Text>
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
    paddingBottom: 48,
    paddingTop: 64,

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
  },
  question: { fontSize: 16, margin: 10 },
  rating: {
    fontWeight: '500',
    color: '#ad0202',
  },
  economy: { fontWeight: '500', color: '#002cb0' },
  motivation: { fontWeight: '500', color: '#0a701f' },
  tactic: { fontWeight: '500', color: '#b5880b' },
  experience: { fontWeight: '500', color: '#bd0f9a' },
})
