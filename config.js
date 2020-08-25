import axios from 'axios';

const host = 'https://staging.api.app.fleettracker.de/api/';

export const api = axios.create({
    baseURL: `${host}`,
});