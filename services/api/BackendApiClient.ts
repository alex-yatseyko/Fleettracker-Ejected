// import { API_BASE_URL_DEV, API_KEY } from 'react-native-dotenv';

import { apiUrl } from 'react-native-dotenv';

class BackendApiClient {
    private getApiBaseUrl(): string {
        return apiUrl;
    }
}

export default new BackendApiClient();