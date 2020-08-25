import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    Platform,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

import Globals from '../component-library/Globals';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { ShipScreen } from './ShipScreen'
import { ScheduleScreen } from './ScheduleScreen'

import { AppContext } from '../context/AppContext'

export const ListScreen = ({ navigation }) => {
    const [notFound, setNotFound] = useState(false)
    const [filteredList, setFilteredList] = useState([])
    const [list, setList] = useState([])

    const context = useContext(AppContext)

    const onFilterList = (e) => {
        let updatedList = list.filter((i) => {
            return i.name.toLowerCase().search(
                e.toLowerCase()) !== -1;
        })
        if (updatedList.length > 0) {
            setNotFound(false)
            // console.log(e)
        } else {
            // console.log('Not found')
            setNotFound(true)
        }
        setFilteredList(updatedList)
    }

    const getListData = async () => {
        try {
            let localList = []
            for (let k = 0; k < context.ships["hydra:member"]?.length; k++) {
                context.ships["hydra:member"][k]['future'] = context.schedules[k] || {}
                localList.push(context.ships["hydra:member"][k])
            }
            setFilteredList(localList)
            setList(localList)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        Object.keys(context.ships).length && Object.keys(context.schedules).length &&
            getListData()
    }, [context.ships, context.schedules])

    return Object.keys(context.ships).length && Object.keys(context.schedules).length
        ? (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TextInput
                        style={styles.headerInput}
                        placeholder="Search Vessel or Ship Group..."
                        onChangeText={onFilterList}
                    />
                </View>
                <ScrollView style={styles.scrollSpace}>
                    {notFound ?
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                height: 275,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    fontSize: 17
                                }}
                            >Not Found</Text>
                        </View>
                        : null}
                    {filteredList.map(schedule => {
                        return (
                            <TouchableWithoutFeedback
                                // onPress={() => {navigation.navigate('Ship')}}
                                onPress={() => {
                                    // navigation.navigate('Ship')}
                                    navigation.navigate('Ship', {
                                        data: `${schedule.name}${schedule['@id'].slice(11, 15)}`,
                                    })
                                }}
                                key={schedule.name}
                            >
                                <View style={styles.listItem} key={schedule.name}>
                                    <View style={styles.scheduleNameWrapper}>
                                        <Text style={styles.scheduleName}>{schedule.name}</Text>
                                        <Text>{schedule.latest_position?.captname ? `Capt. ${schedule.latest_position.captname}` : 'No Captain Data'}</Text>
                                    </View>
                                    {schedule["future"]["hydra:member"] ?
                                        <View style={styles.scheduleFuture}>
                                            <View style={styles.scheduleFutureItem}>
                                                {schedule['future']['hydra:member'][0]['etd'] === 'No data' ?
                                                    <Text style={styles.centerText}>No data</Text> :
                                                    <Text style={styles.centerText}>{`${new Date(Date.parse(schedule['future']['hydra:member'][0]['etd'])).getDate() > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getDate() : `0${new Date(Date.parse(schedule['future']['hydra:member'][0]['etd'])).getDate()}`}.${new Date(Date.parse(schedule['future']['hydra:member'][0]['etd'])).getMonth() + 1 > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][0]['etd'])).getMonth() + 1 : `0${new Date(Date.parse(schedule['future']['hydra:member'][0]['etd'])).getMonth() + 1} `}`}</Text>
                                                }
                                                <View style={styles.circle} />
                                                <Text style={styles.centerBlueText}>{schedule['future']['hydra:member'][0]['countrycode'] ? `${schedule['future']['hydra:member'][0]['countrycode']} ` : ''}
                                                    {schedule['future']['hydra:member'][0]['unlocationcode'] ? schedule['future']['hydra:member'][0]['unlocationcode'] : ''} </Text>
                                            </View>
                                            <View style={styles.scheduleFutureItem}>
                                                {schedule['future']['hydra:member'][1]['etd'] === 'No data' ?
                                                    <Text style={styles.centerText}>No data</Text> :
                                                    <Text style={styles.centerText}>{`${new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getDate() > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getDate() : `0${new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getDate()}`}.${new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getMonth() + 1 > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getMonth() + 1 : `0${new Date(Date.parse(schedule['future']['hydra:member'][1]['etd'])).getMonth() + 1} `}`}</Text>
                                                }
                                                <View style={styles.circle} />
                                                <Text style={styles.centerBlueText}>{schedule['future']['hydra:member'][1]['countrycode'] ? `${schedule['future']['hydra:member'][1]['countrycode']} ` : ''}
                                                    {schedule['future']['hydra:member'][1]['unlocationcode'] ? schedule['future']['hydra:member'][1]['unlocationcode'] : ''} </Text>
                                            </View>
                                            <View style={styles.scheduleFutureItem}>
                                                {schedule['future']['hydra:member'][2]['etd'] === 'No data' ?
                                                    <Text style={styles.centerText}>No data</Text> :
                                                    <Text style={styles.centerText}>{`${new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getDate() > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getDate() : `0${new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getDate()}`}.${new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getMonth() + 1 > 9 ? new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getMonth() + 1 : `0${new Date(Date.parse(schedule['future']['hydra:member'][2]['etd'])).getMonth() + 1} `}`}</Text>
                                                }
                                                <View style={styles.circle} />
                                                <Text style={styles.centerBlueText}>{schedule['future']['hydra:member'][2]['countrycode'] ? `${schedule['future']['hydra:member'][2]['countrycode']} ` : ''}
                                                    {schedule['future']['hydra:member'][2]['unlocationcode'] ? schedule['future']['hydra:member'][2]['unlocationcode'] : ''} </Text>
                                            </View>
                                            <View style={styles.line} />
                                        </View> : null}
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                    }
                </ScrollView>
            </View>
        ) : (
            <View style={styles.loader}>
                <ActivityIndicator size="small" color={Globals.color.background.grey} />
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 100,
        backgroundColor: '#fff'
    },
    scrollSpace: {
        marginTop: 95,
        height: '100%'
    },
    header: {
        position: 'absolute',
        zIndex: 999,
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
        width: '85%',
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
    listItem: {
        borderBottomColor: "#9A9A9A",
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    scheduleNameWrapper: {
        justifyContent: 'center',
    },
    scheduleName: {
        justifyContent: 'center',
        fontWeight: '700',
    },
    scheduleFuture: {
        flexDirection: 'row'
    },
    scheduleFutureItem: {
        width: 70
    },
    circle: {
        backgroundColor: '#4A83B7',
        width: 9,
        height: 9,
        borderRadius: 25,
        marginHorizontal: 30
    },
    line: {
        backgroundColor: '#4A83B7',
        width: 200,
        height: 1,
        position: 'absolute',
        top: Platform.OS === Globals.platform.os.ios ? 21 : 23,
    },
    centerText: {
        textAlign: 'center',
        color: 'black'
    },
    centerBlueText: {
        textAlign: 'center',
        color: '#4A83B7'
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
})
