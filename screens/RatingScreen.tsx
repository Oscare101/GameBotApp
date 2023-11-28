import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PlayersScreen from './PlayersScreen'
import TeamsScreen from './TeamsScreen'
import YearlyRatingScreen from './YearlyRatingScreen'
import { Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
const Tab = createMaterialTopTabNavigator()

export default function RatingScreen({ navigation }: any) {
  function TabBar({ state, descriptors, navigation }: any) {
    return (
      <View
        style={{
          height: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: '#fff',
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          function GetIconName() {
            const icons: any = [
              { icon: isFocused ? 'people' : 'people-outline' },
              { icon: isFocused ? 'albums' : 'albums-outline' },

              { icon: isFocused ? 'calendar' : 'calendar-sharp' },
            ]
            return icons[index].icon
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{
                height: '100%',
                width: '25%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                opacity: isFocused ? 1 : 0.8,
              }}
            >
              <Ionicons name={GetIconName()} size={24} color="black" />
              <Text style={{ fontSize: 10 }}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          height: 1,
        },

        tabBarLabelStyle: {
          fontSize: 14,
          color: '#666',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
      tabBar={(props) => <TabBar {...props} />}
      initialRouteName={'Players'}
    >
      <Tab.Screen name={'Players'} component={PlayersScreen} />
      <Tab.Screen name={'Teams'} component={TeamsScreen} />
      {/* <Tab.Screen name={'Yearly'} component={YearlyRatingScreen} /> */}
    </Tab.Navigator>
  )
}
