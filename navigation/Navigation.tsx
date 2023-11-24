import React, { useEffect } from 'react'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TouchableOpacity, View, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import PlayersScreen from '../screens/PlayersScreen'
import Main from '../screens/Main'
import TournamentsScreen from '../screens/TournamentsScreen'
import TournamentInfoScreen from '../screens/TournamentInfoScreen'
import LaunchScreen from '../screens/LaunchScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export default function Navigation() {
  function TabBar({ state, navigation }: any) {
    const bottomTabData = [
      {
        title: '',
        iconActive: 'person-circle-sharp',
        iconInactive: 'person-circle-outline',
        action: () => {
          navigation.navigate('PlayersNavigation', {
            screen: 'PlayersScreen',
            initial: false,
          })
        },
      },
      {
        title: '',
        iconActive: 'book',
        iconInactive: 'book-outline',
        action: () => {
          navigation.navigate('MainNavigation', {
            screen: 'MainScreen',
            initial: false,
          })
        },
      },
      {
        title: '',
        iconActive: 'rocket',
        iconInactive: 'rocket-outline',
        action: () => {
          navigation.navigate('TournamentsNavigation', {
            screen: 'TournamentsScreen',
            initial: false,
          })
        },
      },
    ]

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          elevation: 5,
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
      >
        {bottomTabData.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              item.action()
            }}
            activeOpacity={0.8}
            style={{
              width: '25%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
              height: '100%',
            }}
          >
            {state.index === index ? (
              <Ionicons name={item.iconActive} size={24} color={'#000'} />
            ) : (
              <Ionicons name={item.iconInactive} size={24} color={'#000'} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  function TournamentsNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="TournamentsScreen"
          component={TournamentsScreen}
        />
      </Stack.Navigator>
    )
  }

  function MainNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="MainScreen"
          component={Main}
        />
      </Stack.Navigator>
    )
  }

  function PlayersNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="PlayersScreen"
          component={PlayersScreen}
        />
      </Stack.Navigator>
    )
  }

  function NavigationApp() {
    return (
      <Tab.Navigator tabBar={(props: any) => <TabBar {...props} />}>
        <Tab.Screen
          name="PlayersNavigation"
          component={PlayersNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="MainNavigation"
          component={MainNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="TournamentsNavigation"
          component={TournamentsNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    )
  }

  const navigationLogIn = (
    <Stack.Navigator initialRouteName="LaunchScreen">
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
        name="LaunchScreen"
        component={LaunchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
        name="NavigationApp"
        component={NavigationApp}
      />
      {/* other screens then must apear without bottom tab navigation */}
      <Stack.Screen
        options={{
          headerShown: false,
          gestureDirection: 'horizontal',
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        name="TournamentInfoScreen"
        component={TournamentInfoScreen}
      />
    </Stack.Navigator>
  )

  return <>{navigationLogIn}</>
}
