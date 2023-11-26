import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PlayersScreen from './PlayersScreen'
import TeamsScreen from './TeamsScreen'

const Tab = createMaterialTopTabNavigator()

export default function RatingScreen({ navigation }: any) {
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
      initialRouteName={'PlayersScreen'}
    >
      <Tab.Screen name={'PlayersScreen'} component={PlayersScreen} />
      <Tab.Screen name={'TeamsScreen'} component={TeamsScreen} />
    </Tab.Navigator>
  )
}