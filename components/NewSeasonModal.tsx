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

export default function NewSeasonModal(props: any) {
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

          <Text style={styles.title}>Start new season</Text>

          <Text style={styles.description}>
            You can make transfers only in the off-season, with the start of the
            new season, buying players will be prohibited
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onSuccess()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: '#9dbef2',
              borderRadius: 10,
              width: '92%',
            }}
          >
            <Text style={{ fontSize: 28, color: '#fff' }}>
              Start new season
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
    marginBottom: 20,
  },
})
