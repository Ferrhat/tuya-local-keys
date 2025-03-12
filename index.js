const crypto = require('crypto');
const axios = require('axios');
const config = require('./config');

// Configuration constants
const { CLIENT_ID, CLIENT_SECRET, ENDPOINT, USER_ID } = config;

/**
 * Generates HMAC-SHA256 signature required for Tuya API authentication
 */
function generateSignature(method, path, headers, body, secret) {
    const timestamp = headers.t;
    const nonce = headers.nonce || '';
    const clientId = headers.client_id;
    const accessToken = headers.access_token || '';

    // Create content hash for body
    const contentHash = crypto.createHash('sha256')
        .update(body || '', 'utf8')
        .digest('hex').toLowerCase();

    // Ensure path doesn't include the base URL
    const urlPath = path.replace(/^https?:\/\/[^/]+/i, '');

    // Construct string to sign following Tuya's format
    const stringToSign = [
        method.toUpperCase(),
        contentHash,
        '', // No custom headers
        urlPath
    ].join('\n');

    // Construct the full string to sign
    const signStr = clientId + accessToken + timestamp + nonce + stringToSign;

    // Generate signature
    return crypto.createHmac('sha256', secret)
        .update(signStr, 'utf8')
        .digest('hex').toUpperCase();
}

/**
 * Makes an API request to the Tuya cloud
 */
async function makeApiRequest(method, path, accessToken = null, data = null) {
    try {
        const timestamp = Date.now().toString();
        const nonce = Math.random().toString(36).substring(2, 15);
        const url = path.startsWith('http') ? path : `${ENDPOINT}${path}`;

        // Prepare headers for signature generation
        const headers = {
            'client_id': CLIENT_ID,
            't': timestamp,
            'sign_method': 'HMAC-SHA256',
            'nonce': nonce,
            'Content-Type': 'application/json'
        };

        if (accessToken) {
            headers['access_token'] = accessToken;
        }

        // Convert data to string if present
        const bodyStr = data ? JSON.stringify(data) : '';

        // Generate the signature using these headers
        headers['sign'] = generateSignature(method, path, headers, bodyStr, CLIENT_SECRET);

        const response = await axios({
            method,
            url,
            headers,
            data: data || undefined
        });

        if (!response.data.success) {
            throw new Error(`API Error: ${response.data.msg}`);
        }

        return response.data.result;
    } catch (error) {
        const errorMessage = error.response?.data?.msg || error.message;
        console.error(`API request failed: ${errorMessage}`);
        throw new Error(`Tuya API Error: ${errorMessage}`);
    }
}

/**
 * Get access token from Tuya API
 */
async function getAccessToken() {
    return makeApiRequest('GET', '/v1.0/token?grant_type=1');
}

/**
 * Get list of devices for the configured user
 */
async function getDeviceList(accessToken) {
    const path = `/v1.0/users/${USER_ID}/devices`;
    return makeApiRequest('GET', path, accessToken);
}

/**
 * Main function to retrieve and display device information
 */
async function main() {
    try {
        console.log('Fetching access token...');
        const tokenData = await getAccessToken();

        console.log('Retrieving device list...');
        const devices = await getDeviceList(tokenData.access_token);

        if (devices.length === 0) {
            console.log('No devices found for this user.');
            return;
        }

        console.log('\nDevices found:');
        console.log('='.repeat(50));
        devices.forEach((device, index) => {
            console.log(`Device #${index + 1}: ${device.name} (${device.id})`);
            console.log(`  • Local Key: ${device.local_key}`);
            console.log(`  • Online: ${device.online ? 'Yes' : 'No'}`);
            console.log('-'.repeat(50));
        });
        console.log(`Total devices: ${devices.length}`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Execute the program
if (require.main === module) {
    main();
}

// Export functions for potential module usage
module.exports = {
    getAccessToken,
    getDeviceList
};
