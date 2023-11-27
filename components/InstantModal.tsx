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

const width = Dimensions.get('window').width

export default function InstantModal(props: any) {
  return (
    <Modal visible={props.visible} transparent={true} style={styles.modal}>
      <StatusBar
        // barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={'#bbb'}
      />
      <View style={styles.modalBG}>
        <View style={styles.modalBlock}>
          <Text style={styles.title}>
            You are going to get the instant result of the match, without
            waiting
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onSuccess()}
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: '#9dbef2',
              borderRadius: 10,
              width: '92%',
            }}
          >
            <Text style={{ fontSize: 28, color: '#fff' }}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onClose()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              // backgroundColor: '#666',
              borderRadius: 10,
              width: '92%',
              marginTop: 10,
              borderColor: '#9dbef2',
              borderWidth: 3,
            }}
          >
            <Text style={{ fontSize: 28, color: '#9dbef2' }}>Back</Text>
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
    paddingBottom: '4%',
    paddingTop: '4%',

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
    fontSize: 20,
    marginBottom: 20,
    width: '92%',
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
