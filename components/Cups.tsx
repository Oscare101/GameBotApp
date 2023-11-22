import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
export default function Cups(props: any) {
  const cup1 = (
    <View
      style={{
        backgroundColor: '#89d0e8',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="snow-outline" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.2 }}>Winer cup</Text>
    </View>
  )
  const cup2 = (
    <View
      style={{
        backgroundColor: '#e0bc87',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="flower-outline" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.2 }}>Spring cup</Text>
    </View>
  )
  const cup3 = (
    <View
      style={{
        backgroundColor: '#989db5',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="globe-outline" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.2 }}>World cup</Text>
    </View>
  )
  const cup4 = (
    <View
      style={{
        backgroundColor: '#e087b1',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="sunny-outline" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.18 }}>Summer cup</Text>
    </View>
  )
  const cup5 = (
    <View
      style={{
        backgroundColor: '#f5878e',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="sunny-outline" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.18 }}>Autumn cup</Text>
    </View>
  )
  const cup6 = (
    <View
      style={{
        backgroundColor: '#727ba6',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="ios-globe" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.18 }}>World cup</Text>
    </View>
  )
  const cup7 = (
    <View
      style={{
        backgroundColor: '#eee',
        height: props.size,
        aspectRatio: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="locate" size={props.size * 0.5} color="black" />
      <Text style={{ fontSize: props.size * 0.18 }}>Major</Text>
    </View>
  )
  const cups: any = [cup1, cup2, cup3, cup4, cup5, cup6, cup7]
  return cups[props.cup - 1]
}
