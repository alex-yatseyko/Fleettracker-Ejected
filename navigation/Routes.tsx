import * as React from 'react';
import  { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';

import { BottomTab } from '../navigation/BottomTab'
import { AuthScreen } from '../screens/AuthScreen'

const Stack = createStackNavigator();

export const Routes = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Auth" 
                component={AuthScreen}
                options={{ 
                  headerShown: false 
                }}
              /> 
              <Stack.Screen
                name="Bottom" 
                component={BottomTab}
                options={{ 
                  headerShown: false 
                }}
              />
        </Stack.Navigator>
    )
}