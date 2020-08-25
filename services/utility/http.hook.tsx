import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from './NavigationService';

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
            }
            const token = await AsyncStorage.getItem('Token')
            headers.Authorization = await `Bearer ${token}`
            const response = await fetch(url, { method, body, headers })
            let data = await response.json()
            if (!response.ok && data?.code !== 401) {
                new Error('Something went wrong')
            }

            setLoading(false)
            return data

        } catch (e) {
            console.log(e)
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    return { loading, request, error }
}

export const refreshToken = async (callback?: Function) => {
    const refresh_token = await AsyncStorage.getItem('RefreshToken')
    const refreshTokenBody = JSON.stringify({ refresh_token })
    const response = await fetch(
        'https://staging.api.app.fleettracker.de/api/token/refresh',
        {
            method: 'POST',
            body: refreshTokenBody,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
        .then(res => res.json())
        .then(async data => {
            if (data.code) {
                NavigationService.navigate('Auth')
                return
            }
            await setToken(data)
            callback && callback()
            return data.token
        })
}

const setToken = async (data) => {
    await AsyncStorage.setItem('Token', data.token)
    await AsyncStorage.setItem('RefreshToken', data.refresh_token)
}