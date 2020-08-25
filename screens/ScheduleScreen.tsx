import React, { useState , useEffect, useContext, useCallback } from 'react';
import { 
    StyleSheet,
    View,
    Text,
    // AsyncStorage,
    Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import IconOld from 'react-native-vector-icons/FontAwesome';
import { useHttp } from '../services/utility/http.hook'

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { AuthContext } from '../context/AuthContext'

import Globals from '../component-library/Globals';
import AsyncStorage from '@react-native-community/async-storage';

export const ScheduleScreen = ({route, navigation}) => {
    const [ schedule, setSchedule ] = useState([])
    const [ agent, setAgent ] = useState([])

    const { request } = useHttp()
    // const token = AsyncStorage.getItem('Token')

    const onShare = async () => {
        try {
          await Share.share({
            title: `${agent.name} schedule details`,
            message:
            //   'Test Let me share this text with other apps',
            `Company Name: ${agent.name},\nAddress:${agent.address1 ? agent.address1 : ' No address'},\nPhone:${agent.phone}, \nAgent Name: ${agent.contact}, \nEmail: ${agent.email}`
            //   `Agent Name:'agent.name} schedule details&body=Address:${agent.address1 ? agent.address1 : ' No address'}, Phone:${agent.phone}, Agent Name: ${agent.contact}, Email: ${agent.email}`
          });
    
        } catch (error) {
          console.log(error.message);
        }
      };

    const auth = useContext(AuthContext)
    const getSchedule = useCallback( async () => {
        const token = await AsyncStorage.getItem('Token')
        // const token = auth.token
        const scheduleId = JSON.parse(route.params.scheduleId)
        try {
            const fetchedSchedule = await request(`https://staging.api.app.fleettracker.de/api/schedule_entries/${scheduleId}`, 'GET', null)
            // console.log(fetchedSchedule)
            setSchedule(fetchedSchedule)

            const fetchedAgent = await request(`https://staging.api.app.fleettracker.de/api/schedule_agents/${fetchedSchedule.scheduleagentid}`, 'GET', null)
            // console.log(fetchedAgent)
            setAgent(fetchedAgent)

            // setLoadingScreen(false)
        } catch(e) {}
    }, [request])

    useEffect(() => {
        getSchedule()
    }, [])

    return(
    <View style={styles.container}>
             <View style={styles.header}>
                <TouchableWithoutFeedback
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="chevron-left" style={styles.leftIcon} />
                </TouchableWithoutFeedback>
                <Text style={styles.headerTitle}>{ agent.city ? `${agent.city},` : ''} {agent.country}</Text>
                
                <TouchableWithoutFeedback
                    onPress={() => {
                        // console.log('Share')
                        onShare()
                    }}
                >
                    <Icon name="reply" style={styles.rightIcon} />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.listWrapper}>
                {agent.name ?
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <IconOld name="user" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.name}</Text>
                </View>
                : null }

                {agent.address1 ?
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <Icon name="home" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.address1}</Text>
                </View>
                : null }

                {agent.phone2 ? 
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <Icon name="phone" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.phone2}</Text>
                </View>
                : null }

                {agent.mobile ? 
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <Icon name="fax" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.mobile}</Text>
                </View>
                : null}

                {agent.mobile2 ? 
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <Icon name="mobile-alt" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.mobile2}</Text>
                </View> 
                : null }

                {agent.email ?
                <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                        <IconOld name="envelope" style={styles.scheduleIcon} />
                    </View>
                    <Text style={styles.mediumText}>{agent.email}</Text>
                </View>
                : null }
            </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
        // padding: 20
        // paddingLeft: 40
      },
      header: {
        paddingTop: 25,
        zIndex: 99,
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        top: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      },
      rightIcon: {
        color: '#4A83B7',
        fontSize: 23,
        transform: [{rotateY: '180deg'}]
      },
      leftIcon: {
        color: '#4A83B7',
        fontSize: 33,
      },
    headerTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
        textTransform: 'uppercase'
    },
    listWrapper: {
        justifyContent: 'space-evenly',
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 50,
        paddingRight: 120,
    },
      scheduleIcon: {
          fontSize: 30,
          color: '#4A83B7',
          marginRight: 20
      },
      mediumText: {
        fontSize: Globals.font.size.medium
      },
      listIcon: {
            minWidth: 50
      },
      listItem: {
          flexDirection: 'row',
          alignItems: 'center',
      }
  });