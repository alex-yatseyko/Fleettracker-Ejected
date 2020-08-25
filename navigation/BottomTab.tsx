import React, { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ifIphoneX } from 'react-native-iphone-x-helper'

/* Screens */
import { MapScreen } from '../screens/MapScreen'
import { ListNavigation } from '../screens/ListNavigation'
import { SettingsScreen } from '../screens/SettingsScreen'

export const BottomTab = ({navigation}) => {
    const Tab = createMaterialBottomTabNavigator();

    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      setLoading(false)
      // setTimeout(setLoading(false))
      // setTimeout(function(){ setLoading(false); }, 3000);
    }, [])

    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#aaa" />
        </View>
      )
    }

    return (
        <Tab.Navigator 
          barStyle={{ 
            backgroundColor: '#fff', 
            height: 70, 
            zIndex: 999, 
            ...ifIphoneX({
                height: 100,
                paddingTop: 10,
            }, {
                height: 70
            }) 
          }}
          initialRouteName="Map"
        >  
          <Tab.Screen 
            name="Map" 
            component={ MapScreen } 
            options={{
              tabBarLabel: '',
              tabBarIcon: () => (
                <Icon name="globe" style={styles.icon} />
              ),
            }}
          />
          <Tab.Screen 
            name="List" 
            component={ ListNavigation } 
            options={{
              tabBarLabel: '',
              tabBarIcon: () => (
                <Icon name="list"  style={styles.icon}/>
              ),
            }}
          />
          <Tab.Screen 
            name="Settings"  
            component={ SettingsScreen } 
            options={{
              tabBarLabel: '',
              tabBarIcon: () => (
                <Icon name="cog"  style={styles.icon}/>
              ),
            }}
          />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    icon: {  
      color: '#A1A1A1',
      fontSize: 25,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: '#fff'
    },
})
