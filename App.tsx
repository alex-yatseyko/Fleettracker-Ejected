import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  // AsyncStorage
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { AppContext } from './context/AppContext'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './services/utility/Auth.hook'
import { useAppContext } from './services/utility/AppContext.hook'

import { Routes } from './navigation/Routes'

import * as SplashScreen from 'expo-splash-screen';
import { isAvailable } from 'expo/build/AR';
import NavigationService from './services/utility/NavigationService';

export default function App(props) {
  let navigatorRef = React.useRef(null);

  const { token, login, logout, } = useAuth()
  const { ships, loadShips, schedules, loadSchedules, } = useAppContext()

  const getToken = async () => {
    return AsyncStorage.getItem('Token')
  }

  React.useEffect(() => {
    NavigationService.setTopLevelNavigator(navigatorRef)
    async function loadResourcesAndDataAsync() {
      try {
        const token = await getToken()
        token && NavigationService.navigate('Bottom', null)
        SplashScreen.preventAutoHide();
      } catch (e) {
        console.log('Error: ', e)
        console.warn(e);
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  console.disableYellowBox = true;
  const isAuthenticated = !!token
  return (
    <AuthContext.Provider value={{
      token, login, logout, isAuthenticated
    }}>
      <AppContext.Provider value={{
        ships, loadShips, schedules, loadSchedules,
      }}>
        <NavigationContainer ref={navigatorRef}>
          <View style={styles.container}>
            <Routes auth={isAuthenticated ? true : false} />
          </View>
        </NavigationContainer>
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -20,
  },
  bottomTabNavigation: {
    zIndex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1
  },
  headerIcon: {
    width: 35,
    fontSize: 23,
    color: '#4A83B7',
  }
});
