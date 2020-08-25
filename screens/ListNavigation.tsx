import React, { useState, useEffect, useContext } from 'react';
import { 
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    Platform, 
    AsyncStorage
} from 'react-native';

import { ListScreen } from './ListScreen'
import { ShipScreen } from './ShipScreen'
import { ScheduleScreen } from './ScheduleScreen'

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const ListNavigation = () => {
    return(
        <Stack.Navigator initialRouteName="ListScreen">
            <Stack.Screen 
                name="ListScreen" 
                component={ListScreen} 
                options={{ 
                    headerShown: false 
                }}
             />
        </Stack.Navigator>
    )
}