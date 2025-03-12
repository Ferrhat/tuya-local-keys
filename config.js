/**
 * Configuration for Tuya API access
 */
module.exports = {
    // Your Tuya IoT platform credentials
    CLIENT_ID: 'your_client_id_here',
    CLIENT_SECRET: 'your_client_secret_here',

    /*
    Tuya API endpoints for different regions:
    - China: https://openapi.tuyacn.com
    - America: https://openapi.tuyaus.com
    - America (Azure): https://openapi-ueaz.tuyaus.com
    - Europe: https://openapi.tuyaeu.com
    - Europe (Azure): https://openapi-weaz.tuyaeu.com
    - India: https://openapi.tuyain.com
    */
    ENDPOINT: 'https://openapi.tuyaeu.com',

    // Your Tuya user ID
    USER_ID: 'your_user_id_here'
};
