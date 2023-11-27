import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { NavigationContainer } from '@react-navigation/native'
import Navigation from './navigation/Navigation'

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Provider>
  )
}
