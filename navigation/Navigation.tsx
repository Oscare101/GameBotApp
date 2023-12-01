import React from 'react'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import PlayersScreen from '../screens/PlayersScreen'
import TournamentsScreen from '../screens/TournamentsScreen'
import TournamentInfoScreen from '../screens/TournamentInfoScreen'
import LaunchScreen from '../screens/LaunchScreen'
import PlayerInfoScreen from '../screens/PlayerInfoScreen'
import RatingScreen from '../screens/RatingScreen'
import TeamsScreen from '../screens/TeamsScreen'
import InformationScreen from '../screens/InformationScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export default function Navigation() {
  function TabBar({ state, navigation }: any) {
    const bottomTabData = [
      {
        title: 'Rating',
        iconActive: 'stats-chart',
        iconInactive: 'stats-chart-outline',
        action: () => {
          navigation.navigate('RatingNavigation', {
            screen: 'RatingScreen',
            initial: false,
          })
        },
      },
      {
        title: 'Tournaments',
        iconActive: 'grid',
        iconInactive: 'grid-outline',
        action: () => {
          navigation.navigate('TournamentsNavigation', {
            screen: 'TournamentsScreen',
            initial: false,
          })
        },
      },
      {
        title: 'Information',
        iconActive: 'information-circle',
        iconInactive: 'information-circle-outline',
        action: () => {
          navigation.navigate('InformationNavigation', {
            screen: 'InformationScreen',
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
              width: '33%',
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
            <Text>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  function InformationNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="InformationScreen"
          component={InformationScreen}
        />
      </Stack.Navigator>
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

  function RatingNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="RatingScreen"
          component={RatingScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="PlayersScreen"
          component={PlayersScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="TeamsScreen"
          component={TeamsScreen}
        />
      </Stack.Navigator>
    )
  }

  function NavigationApp() {
    return (
      <Tab.Navigator tabBar={(props: any) => <TabBar {...props} />}>
        <Tab.Screen
          name="RatingNavigation"
          component={RatingNavigation}
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
        <Tab.Screen
          name="InformationNavigation"
          component={InformationNavigation}
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
        }}
        name="TournamentInfoScreen"
        component={TournamentInfoScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PlayerInfoScreen"
        component={PlayerInfoScreen}
      />
    </Stack.Navigator>
  )

  return <>{navigationLogIn}</>
}
