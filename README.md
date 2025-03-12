# Tuya Local Keys Node.js Tool

A simple utility to retrieve local keys for Tuya devices using the Tuya Cloud API.

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Tuya credentials in `config.js`

## Configuration

Edit `config.js` with your Tuya IoT Platform credentials:

```javascript
module.exports = {
    CLIENT_ID: 'your_client_id_here',
    CLIENT_SECRET: 'your_client_secret_here',
    ENDPOINT: 'https://openapi.tuyaeu.com',
    USER_ID: 'your_user_id_here'
};
```

## Usage

Run the tool with:

```bash
node index.js
```

This will output all your devices with their local keys.

## Getting Tuya IoT Credentials

1. Create a Tuya developer account at [iot.tuya.com](https://iot.tuya.com/)
2. Create a cloud project
3. Link your account to the project
4. Obtain your Client ID and Secret from the project
5. Get your User ID from your account details

## Notes

- Local keys are required for local control of Tuya devices without cloud dependency
- Keys retrieved are specific to your account and should be kept secure
