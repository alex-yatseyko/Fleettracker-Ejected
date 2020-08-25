import { useState, useCallback, useEffect } from 'react'

export const useAppContext = () => { 
    const [ships, setShips] = useState([])
    const [schedules, setSchedules] = useState([])

    const loadShips = useCallback((data) => {
        setShips(data)
    }, [])

    const loadSchedules= useCallback((data) => {
        setSchedules(data)
    }, [])

    return { ships, loadShips, schedules, loadSchedules }
}