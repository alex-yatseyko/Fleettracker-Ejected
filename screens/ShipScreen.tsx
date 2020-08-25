import React, { useState, useEffect, useContext } from 'react';
import { 
    StyleSheet,
    View,
    Text,
    // AsyncStorage,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useHttp } from '../services/utility/http.hook'
import Globals from '../component-library/Globals';
import countries from '../assets/data/countryCodeISO.json'
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from '../context/AuthContext'

export const ShipScreen = ({route, navigation}) => {
    const [ future, setFuture ] = useState([])
    const [ location, setLocation ] = useState()
    const [ idSchedule, setIdSchedule ] = useState()
    
    const [ loading, setLoading ] = useState(true)
    const [ loaded, setLoaded ] = useState(false)
    const [ badRequest, setBadRequest ] = useState(false)


    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const { data } = route.params;
    const getShip = async () => {
        setLoading(true)
        // const token = auth.token
        let token = await AsyncStorage.getItem('Token')
        // console.log(token)
        if(token == null) {
            const name = await AsyncStorage.getItem('Name')
            const pass = await AsyncStorage.getItem('Pass')
    
            console.log('Name', name)
            console.log('Pass', pass)

            try {
                const name = await AsyncStorage.getItem('Name')
                const pass = await AsyncStorage.getItem('Pass')
                const data = await request(
                  'https://staging.api.app.fleettracker.de/api/token', 
                  'POST', 
                  {'name': name, 'password': pass}, 
                  {'Content-Type': 'application/json'}
                )
                console.log(data)
              } catch (e) {
                console.log(e)
            }
        }
        const shipId = data.slice(data.length - 4, data.length)
        try {
            const fetchedShip = await request(`https://staging.api.app.fleettracker.de/api/ships/${shipId}`, 'GET', null)
            const fetchedShipLatestPosition = await request(`https://staging.api.app.fleettracker.de/api/ships/${shipId}/latest_position`, 'GET', null)

            const scheduleId = fetchedShip['schedules'][0]['@id'].slice(15, 19)
            setIdSchedule(scheduleId)

            const fetchedFuture = await request(`https://staging.api.app.fleettracker.de/api/future_schedule_entries?schedule_id=${scheduleId}`, 'GET', null)

            /* Places requests */
            for (let i = 0; i < fetchedFuture['hydra:member'].length; i++) {
                let fixedID = fetchedFuture['hydra:member'][i]['fixedObject'].slice(19, 24) 

                const fetchedFixedObj = await request(`https://staging.api.app.fleettracker.de/api/fixed_objects/${fixedID}`, 'GET', null)
                fetchedFuture['hydra:member'][i]['unlocationcode'] = fetchedFixedObj.unlocationcode
                fetchedFuture['hydra:member'][i]['countrycode'] = fetchedFixedObj.countrycode
                fetchedFuture['hydra:member'][i]['name'] = fetchedFixedObj.name
            }

            /* Places requests */

            for (let i = 0; i < fetchedFuture['hydra:member'].length; i++) {
                let fixedID = fetchedFuture['hydra:member'][i]['fixedObject'].slice(19, 24) 

                const fetchedFixedObj = await request(`https://staging.api.app.fleettracker.de/api/fixed_objects/${fixedID}`, 'GET', null)

                fetchedFuture['hydra:member'][i]['unlocationcode'] = fetchedFixedObj.unlocationcode
                fetchedFuture['hydra:member'][i]['countrycode'] = fetchedFixedObj.countrycode
                fetchedFuture['hydra:member'][i]['name'] = fetchedFixedObj.name
            }
            setFuture(fetchedFuture)
            setLoading(false)
            setLoaded(true)
        } catch(e) {
            setLoading(false)
            setBadRequest (true)
            // console.log(e)
            console.log('check bad', badRequest)
            // alert('Future Schedules Not Found for this ship')
            // navigation.goBack()
        }
    }

    useEffect(() => {
        getShip()
    }, [])

    if(!loaded) {
        return(
            <View style={styles.notFound}>
                <Text>Future Schedules Not Found for this ship</Text>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableWithoutFeedback
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="chevron-left" style={styles.leftIcon} />
                </TouchableWithoutFeedback>
                <Text style={styles.headerTitle}>{data.slice(0, -4)}</Text>
                <TouchableWithoutFeedback
                    style={{opacity: 0}}
                >
                    <Icon name="crosshairs" style={styles.rightIcon} />
                </TouchableWithoutFeedback>
            </View>

            {/* {if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Globals.color.main} />
            </View>
        )
    }} */}
            {loading ? () => {
                        return (
                            <View style={styles.loader}>
                                <ActivityIndicator size="large" color={Globals.color.main} />
                            </View>
                        )
            } : null}
            {!future['hydra:member'] || badRequest || !future ? () => {
                return(
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.notFound}>
                            <Text style={{paddingTop: 0}}>Future Schedules Not Found for this ship</Text>
                        </View>
                    </ScrollView>  
                )
            } :
                <ScrollView style={styles.scrollView}>
                    {/* {!future['hydra:member'] ? () => {
                        return(
                            <View style={styles.notFound}>
                                <Text style={{paddingTop: 200}}>Future Schedules Not Found for this ship</Text>
                            </View>
                        )
                    }
                    : null
                    } */}
                    {(future['hydra:member'].length > 0) ? future['hydra:member'].map(i => {
                        return(
                            <View key={i['@id']} style={styles.detailsSchedule}>
                                <TouchableWithoutFeedback
                                    onPress={() => {navigation.navigate('Schedule', {
                                        scheduleId: i['@id'].slice(22, 28)
                                    })}}
                                    style={styles.scheduleWrapper}
                                >
                                    <View style={styles.detailsPlace}>
                                        <Text style={styles.placeText}>{i['countrycode']} {i['unlocationcode']}</Text>
                                        <Text style={styles.mainText}>
                                            <Text style={styles.boldText}>{i['name']},{"\n"} </Text> 
                                            <Text style={styles.detailsCountry}>{countries[`${i['countrycode']}`]}</Text>
                                        </Text>
                                        <Text
                                            style={styles.activities}
                                        >{i['portactivities'][0] ? i['portactivities'][0] : 'No data'}{i['portactivities'][1] ?', ' + i['portactivities'][1] : ''}{i['portactivities'][2] ?', \n' + i['portactivities'][2] : ''}</Text>
                                    </View>
                                    <View style={styles.detailsTimeline}>
                                        <View style={styles.circle} />
                                        <View style={styles.scheduleLineDetails} />
                                    </View>
                                    <View style={styles.detailsDates}>
                                        <View style={styles.dateWrapper}>
                                            <Text style={styles.dateText}>{new Date(Date.parse(i['eta'])).getDate() > 9 ? new Date(Date.parse(i['eta'])).getDate() : `0${new Date(Date.parse(i['eta'])).getDate()}`}.
                                            {new Date(Date.parse(i['eta'])).getMonth() + 1 > 9 ? new Date(Date.parse(i['eta'])).getMonth() + 1 : `0${new Date(Date.parse(i['eta'])).getMonth() + 1} `}
                                            {`${new Date(Date.parse(i['eta'])).getHours()}:00`}</Text>
                                            <Text style={styles.greyText}>  ETA</Text>
                                        </View>
                                        <View style={styles.dateWrapper}>
                                            <Text style={styles.dateText}>{new Date(Date.parse(i['etd'])).getDate() > 9 ? new Date(Date.parse(i['etd'])).getDate() : `0${new Date(Date.parse(i['etd'])).getDate()}`}.
                                            {new Date(Date.parse(i['etd'])).getMonth() + 1 > 9 ? new Date(Date.parse(i['etd'])).getMonth() + 1 : `0${new Date(Date.parse(i['etd'])).getMonth() + 1} `}  
                                            {`${new Date(Date.parse(i['etd'])).getHours()}:00`}</Text>
                                            <Text style={styles.greyText}>  ETB</Text>
                                        </View>
                                        <View style={styles.dateWrapper}>
                                            <Text style={styles.dateText}>{new Date(Date.parse(i['etd'])).getDate() > 9 ? new Date(Date.parse(i['etd'])).getDate() : `0${new Date(Date.parse(i['etd'])).getDate()}`}.
                                            {new Date(Date.parse(i['etd'])).getMonth() + 1 > 9 ? new Date(Date.parse(i['etd'])).getMonth() + 1 : `0${new Date(Date.parse(i['etd'])).getMonth() + 1} `} 
                                            {`${new Date(Date.parse(i['etd'])).getHours()}:00`}</Text>
                                            <Text style={styles.greyText}>  ETD</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        )})
                    : <View style={styles.notFound}>
                        <Text>Future Schedules Not Found for this ship</Text>
                    </View>}
                    <View style={{height: 100}}/>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 80,
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
    },
    leftIcon: {
        color: '#4A83B7',
        fontSize: 33,
    },
    headerTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333'
    },
    scrollView: {
        paddingTop: 40,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    notFound: {
        height: Dimensions.get('window').height * 0.6,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scheduleWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    detailsSchedule: {
        flexDirection: 'row',
    },
    detailsPlace: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15,
        width: '100%'
    },
    detailsDates: {
        textAlign: 'right',
        width: 145,
        minWidth: 130,
        paddingLeft: 10,
        paddingRight: 20,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    detailsTimeline: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    circle: {
        backgroundColor: '#4A83B7',
        width: 7,
        height: 7,
        borderRadius: 25,
        position: 'absolute',
        left: -3,
    },
    scheduleLineDetails: {
        backgroundColor: '#4A83B7',
        width: 1,
        height: 160,
    },
    detailsCountry: {
        textTransform: 'uppercase',
    },
    placeText: {
        color: '#707070',
    },
    activities: {
        textAlign: 'right',
    },
    boldText: {
        fontWeight: '800',
        textAlign: 'right',
    },
    mainText: {
        color: '#4A83B7',
    },
    dateWrapper: {
        flexDirection: 'row',
    },
    dateText: {
        color: '#707070',
        textAlign: 'right'
    },
    greyText: {
        color: '#BFBFBF',
        textAlign: 'right',
    },
  });