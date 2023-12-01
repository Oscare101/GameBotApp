import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ExplainingModal from '../components/ExplainingModal'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Teams from '../components/Teams'

export default function InformationScreen({ navigation }: any) {
  const [explainingModal, setExplainingModal] = useState<boolean>(false)

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#eee'} />

        <Text style={styles.title}>What is this game about?</Text>
        <Text style={styles.description}>
          Simply put, this is a simulation of an e-sports direction, completely
          fictional. There are 16 teams in the field, 5 players each. you own
          the NOVA team, and your main task is to lead the team to victories, to
          the top 1
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '92%',
            justifyContent: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 20 }}>You own the</Text>
          <Teams team={'NOVA'} />
          <Text style={{ fontSize: 20 }}>NOVA team</Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '92%',
          }}
          activeOpacity={0.8}
          onPress={() => setExplainingModal(true)}
        >
          <Text style={{ fontSize: 18, marginRight: 5, color: '#666' }}>
            You can read about how the matches take place here
          </Text>
          <Ionicons name="open-outline" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.description}>
          Participate in tournaments and collect prizes, which you can then
          spend on improving and practicing your team or buying other players
          from other teams
        </Text>
        <Text style={styles.description}>
          Just open the profile of any player or team, at the bottom near the
          team information you will see three dots, there you will be able to
          take actions, if your team, then practice, if someone else's, then buy
        </Text>
        <ExplainingModal
          visible={explainingModal}
          onClose={() => setExplainingModal(false)}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    width: '92%',
    textAlign: 'left',
    marginTop: 5,
  },
})
