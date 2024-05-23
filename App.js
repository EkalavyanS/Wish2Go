import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from "./pages/Map";
import Home from './pages/Home';
import AddPlace from './pages/AddPlace';
import LocationMonitoring from './components/LocalMonitoring';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="Map" component={Map} options={{ title: 'Map' }} />
        <Stack.Screen name="AddPlace" component={AddPlace} options={{ title: 'Add Place' }} />
      </Stack.Navigator> 
      <LocationMonitoring />
    </NavigationContainer>
  );
};

export default App;
