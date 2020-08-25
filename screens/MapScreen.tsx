import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  // AsyncStorage,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {
  WebViewLeaflet,
  WebViewLeafletEvents,
  WebviewLeafletMessage,
} from "../services/utility/react-native-webview-leaflet";

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useHttp, refreshToken } from '../services/utility/http.hook'

import { ShipScreen } from './ShipScreen'
import { SettingsScreen } from './SettingsScreen'
import { ScheduleScreen } from './ScheduleScreen'

import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';

import Globals from '../component-library/Globals';
import { AppContext } from '../context/AppContext';

const axios = require('axios');

type LatLngObject = { lat: number; lng: number };

const Stack = createStackNavigator();
// const icon = `<svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640" width="40" height="40"><defs><path d="M320.8 7.2L501.6 640L140 640L320.8 7.2Z" id="b1OuTbAhqc"></path></defs><g><g><g><use xlink:href="#b1OuTbAhqc" opacity="1" fill="#fefe02" fill-opacity="1"></use><g><use xlink:href="#b1OuTbAhqc" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="14" stroke-opacity="1"></use></g></g></g></g></svg>`
const scale = .6;

export const MapScreen = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="Ship"
        component={ShipScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const Map = ({ navigation }) => {
  const auth = React.useContext(AuthContext)
  const [mapCenterPosition, setMapCenterPosition] = useState({
    lat: 40.153238,
    lng: 12.986282
  });
  const [search, setSearch] = useState([])
  const [ownPosition, setOwnPosition] = useState(null);
  const [webViewLeafletRef, setWebViewLeafletRef] = useState(null);

  // const [token, setToken] = useState()

  const [scheduleIds, setScheduleIds] = useState()

  const [notFound, setNotFound] = useState(false)
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])

  const [loading, setLoading] = useState(true)

  const img = require('../assets/logo.png')
  const hereCredentials = {
    appId: 'T94boxXXrApFtc58WmGz',
    apiKey: 'aJYTveJijLx5bMV5Qt4-pXKHvbH9CblzqBiq3dRZRDA'
  }
  const themes = [
    'normal.day',
    'reduced.night'
  ]
  const hereTileUrl = `https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${themes[0]}/{z}/{x}/{y}/256/png8?apiKey=${hereCredentials.apiKey}&app_id=${hereCredentials.appId}`
  const { error, request } = useHttp()
  const context = useContext(AppContext)

  const onMessageReceived = (message: WebviewLeafletMessage) => {
    switch (message.event) {
      case WebViewLeafletEvents.ON_MAP_MARKER_CLICKED:
        navigation.navigate('Ship', {
          data: message.payload.mapMarkerID,
        })
      default:
    }
  };

  const onFilterList = (e) => {
    let updatedList = locations.filter((i) => {
      return i.title.toLowerCase().search(
        e.nativeEvent.text.toLowerCase()) !== -1;
    })
    if (updatedList.length > 0) {
      setNotFound(false)
    } else {
      setNotFound(true)
    }
    setFilteredLocations(updatedList)
  }

  const getMapData = async () => {
    setLoading(true)
    try {
      const fetched: any = await request(`https://staging.api.app.fleettracker.de/api/ships`, 'GET')

      if (fetched.code === 401) {
        refreshToken(getMapData)
        return
      }
      // Creating arrays to store data
      const fetchedShipIds = []
      const fetchedScheduleIds = []

      const data = []

      // /* Function for getting IDs */
      const getIds = (item) => {
        const idKey = item['@id'].slice(11, 15)
        const schedule = item['schedules']
        if (!schedule.length) return
        const scheduleIdKey = item['schedules'][0]['@id'].slice(15, 19)
        fetchedShipIds.push(idKey)
        fetchedScheduleIds.push(scheduleIdKey)

        data.push({
          "id": idKey,
          "icon": '',
          "position": '',
          "title": item['name'],
          "name": `${item['name']}${idKey}`,
        })
      }

      // Loop for getting ids
      fetched['hydra:member'].forEach(getIds)
      setScheduleIds(fetchedScheduleIds)
      for (let i = 0; i < fetchedShipIds.length; i++) {
        const _id = fetchedShipIds[i]
        let fetchedDetails = await request(`https://staging.api.app.fleettracker.de/api/ships/${_id}/latest_position`, 'GET')
        if (fetchedDetails == null) {
          fetchedDetails = ''
        }

        fetched['hydra:member'][i]['latest_position'] = fetchedDetails

        if (data[i]["id"] === _id) {

          data[i]["icon"] =
            `<div style="margin-top: -20px;">
                  <img style='transform: scale(${scale}) rotate(${fetchedDetails.cmg}deg)' src="http://yatseyko.com/wp-content/uploads/2020/04/method-draw-image-2.svg" />
                  <div style="font-size: 12px; font-weight: 800; text-align: center; margin-top: -14px; text-shadow: -1.5px 2px 2px #fff, 1.5px 2px 2px #fff, -1.5px -2px 2px #fff, 1.5px -2px 2px #fff;
                }background: transparent;">${data[i]["title"]}</div>
                </div>`
          data[i]["position"] = { lat: fetchedDetails.posy / 60000, lng: fetchedDetails.posx / 60000 }
        }
      }
      setLoading(false)
      context.loadShips(fetched)

      if (data) {
        setLocations(data)
        setFilteredLocations(data)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const getListData = async () => {
    if (scheduleIds) {
      try {
        let fetchedFuture = []
        for (let j = 0; j < scheduleIds.length; j++) {
          const _id = scheduleIds[j]
          try {
            let fetchedSchedule = await request(`https://staging.api.app.fleettracker.de/api/future_schedule_entries?schedule_id=${_id}`, 'GET')

            if (fetchedSchedule.code === 401) {
              refreshToken(getListData)
              return
            }

            if (fetchedSchedule['hydra:member'].length === 1) {
              fetchedSchedule = {
                'hydra:member': [
                  { etd: fetchedSchedule['hydra:member'][0]['eta'], foid: fetchedSchedule['hydra:member'][0]['foid'] },
                  { eta: 'No data', etd: 'No data' },
                  { eta: 'No data', etd: 'No data' }
                ]
              }
            }
            if (fetchedSchedule['hydra:member'].length === 2) {
              fetchedSchedule = {
                'hydra:member': [
                  { etd: fetchedSchedule['hydra:member'][0]['eta'], foid: fetchedSchedule['hydra:member'][0]['foid'] },
                  { etd: fetchedSchedule['hydra:member'][1]['eta'], foid: fetchedSchedule['hydra:member'][1]['foid'] },
                  { eta: 'No data', etd: 'No data' }
                ]
              }
            }
            if (fetchedSchedule['hydra:totalItems'] === 0) {
              fetchedSchedule = {
                'hydra:member': [
                  { eta: 'No data', etd: 'No data' },
                  { eta: 'No data', etd: 'No data' },
                  { eta: 'No data', etd: 'No data' }
                ]
              }
            }

            if (fetchedSchedule['hydra:member'][0]['foid']) {
              let obj1 = await request(`https://staging.api.app.fleettracker.de/api/fixed_objects/${fetchedSchedule['hydra:member'][0]['foid']}`, 'GET')
              fetchedSchedule['hydra:member'][0]['countrycode'] = obj1['countrycode']
              fetchedSchedule['hydra:member'][0]['unlocationcode'] = obj1['unlocationcode']
            }
            if (fetchedSchedule['hydra:member'][1]['foid']) {
              let obj1 = await request(`https://staging.api.app.fleettracker.de/api/fixed_objects/${fetchedSchedule['hydra:member'][1]['foid']}`, 'GET')
              fetchedSchedule['hydra:member'][1]['countrycode'] = obj1['countrycode']
              fetchedSchedule['hydra:member'][1]['unlocationcode'] = obj1['unlocationcode']
            }
            if (fetchedSchedule['hydra:member'][2]['foid']) {
              let obj1 = await request(`https://staging.api.app.fleettracker.de/api/fixed_objects/${fetchedSchedule['hydra:member'][2]['foid']}`, 'GET')
              fetchedSchedule['hydra:member'][2]['countrycode'] = obj1['countrycode']
              fetchedSchedule['hydra:member'][2]['unlocationcode'] = obj1['unlocationcode']
            }

            fetchedFuture.push(fetchedSchedule)

          } catch (e) {
            const fetchedSchedule = {
              'hydra:member': [
                { eta: 'No data', etd: 'No data' },
                { eta: 'No data', etd: 'No data' },
                { eta: 'No data', etd: 'No data' },
              ]
            }
            fetchedFuture.push(fetchedSchedule)
          }
        }

        context.loadSchedules(fetchedFuture)
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    getMapData()
  }, [])

  useEffect(() => {
    getListData()
  }, [scheduleIds])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#aaa" />
      </View>
    )
  }

  return (
    <View style={{ height: '100%' }}>
      <TouchableHighlight
        style={styles.refresh}
        onPress={() => {
          getMapData()
          getListData()
        }
        }
      >
        <Icon name='refresh' style={styles.refreshIcon} />
      </TouchableHighlight>
      <View style={styles.header}>
        <TextInput
          style={styles.headerInput}
          textContentType="name"
          placeholder="Search Vessel or Ship Group..."
          onChange={onFilterList}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('List')
          }}
        >
          <View style={styles.headerButtonWrapper}>
            <Icon name='bars' style={styles.headerButton} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <WebViewLeaflet
        // ref={(ref: WebViewLeaflet) => {setWebViewLeafletRef(ref)}}
        onMessageReceived={onMessageReceived}
        mapLayers={[
          {
            baseLayerName: "HereTileLayer",
            url: hereTileUrl,
          },
        ]}
        mapMarkers={[
          ...filteredLocations.map(location => {
            return {
              id: location.name.replace(" ", "-"),
              position: location.position,
              icon: location.icon,
            };
          }),
        ]}
        mapCenterPosition={mapCenterPosition}
        zoom={4}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    zIndex: 9999999,
    width: '100%',
    marginTop: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerInput: {
    padding: 10,
    borderColor: 'transparent',
    borderRadius: 8,
    margin: 'auto',
    width: '75%',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButtonWrapper: {
    marginLeft: 15,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButton: {
    color: '#A1A1A1',
    fontSize: 22,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#fff'
  },
  refresh: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: Globals.color.main,
    bottom: 28,
    right: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 60
  },
  refreshIcon: {
    color: 'white',
    fontSize: 25,
  },
  headerIcon: {
    width: 35,
    fontSize: 23,
    color: '#4A83B7',
  }
});