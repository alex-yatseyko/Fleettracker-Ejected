import { createContext } from 'react';

function noop() {}

export const AppContext = createContext({ 
    lang: 'en',
    loadShips: noop,
    ships: [],
    loadSchedules: noop,
    schedules: null,
});