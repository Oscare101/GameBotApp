import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
export default function ExplainGrid() {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', width: '92%' }}
      >
        <View
          style={[
            styles.gridButton,
            {
              backgroundColor: '#9dbef2',
            },
          ]}
        >
          <Ionicons name="ios-play-outline" size={24} color="black" />
        </View>

        <Text style={{ flex: 1 }}> - see the match in real time (1-2 min)</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '92%',
        }}
      >
        <View
          style={[
            styles.gridButton,
            {
              backgroundColor: '#95deaf',
            },
          ]}
        >
          <Ionicons name="timer-outline" size={24} color="black" />
        </View>
        <Text style={{ flex: 1 }}> - instant result of the match</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  gridButton: {
    padding: 5,
    width: 34,
    height: 34,
    borderRadius: 5,

    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
