import React from 'react'
import {
  View,
  Text,
  useColorScheme,
  Modal,
  TouchableOpacity,
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TheGrandSlamCupBig } from '../constants/icons'
import rules from '../constants/rules'

const width = Dimensions.get('window').width

export default function GrandSlamModal(props: any) {
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
          <Text style={styles.title}>The Grand Slam</Text>
          <TheGrandSlamCupBig />
          <Text style={styles.description}>
            The team that wins the most tournaments in a season, namely 4 or
            more, receives a special status, a grand slam champion and{' '}
            {rules.grandSlamPrize
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
            $
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
    fontSize: 18,
    width: '92%',
  },
})
