import { Provider } from 'react-redux'
import Main from './screens/Main'
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
