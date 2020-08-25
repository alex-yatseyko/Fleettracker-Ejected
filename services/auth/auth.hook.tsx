// import { useState, useCallback, useEffect } from 'react'
// // import AsyncStorage from '@react-native-community/async-storage';
// // import SyncStorage from 'sync-storage';
// import { AsyncStorage } from 'react-native';

// export const useAuth = () => {
//     const [token, setToken] = useState(null)
//     // const [refreshToken, setRefreshToken] = useState(null)
//     const [ready, setReady] = useState()

//     const login = (jwtToken
//         // jwtRefreshToken, login, pass
//         ) => {
//         setToken(jwtToken)
//         AsyncStorage.setItem('token', jwtToken)
//         // AsyncStorage.setItem('Name', login)
//         // AsyncStorage.setItem('Password', pass)
//     }

//     const logout = useCallback(() => {
//         console.log(token)
//         setToken( null )
//         AsyncStorage.removeItem('token');
//         AsyncStorage.removeItem('Name');
//         AsyncStorage.removeItem('Password');
//     }, [])

//     const checkToken = async () => {
//         const token = await AsyncStorage.getItem('token');

//         console.log('Checks', token)

//         if ( token ) {
//             login(token)
//         }
//         setReady(true)
//     }

//     useEffect(() => {
//         checkToken();
//     }, [ login ])

//     return { login, logout, token }
// }