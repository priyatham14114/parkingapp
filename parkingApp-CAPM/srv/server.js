// const express = require('express');
// const bodyParser = require('body-parser');
// const twilio = require('twilio');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const port = 8080;  // Ensure this port matches your AJAX request

// app.use(bodyParser.json());

// // Custom CORS middleware
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://port4004-workspaces-ws-vl68p.us10.trial.applicationstudio.cloud.sap');  // Replace with your client's origin
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (req.method === 'OPTIONS') {
//         // Preflight request handling
//         return res.status(200).send();
//     }
//     next();
// });

// // Basic route for the root URL
// app.get('/', (req, res) => {
//     res.send('Welcome to the SMS Service');
// });

// // Load environment variables from default-env.json
// let env;
// const envPath = path.join(__dirname, 'default-env.json');

// try {
//     env = JSON.parse(fs.readFileSync(envPath, 'utf8'));
// } catch (error) {
//     console.error(`Error reading ${envPath}:`, error);
//     process.exit(1);
// }

// // Twilio credentials
// const accountSid = env.TWILIO_ACCOUNT_SID;
// const authToken = env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

// // Endpoint to send SMS
// app.post('/send-sms', (req, res) => {
//     const { to, message } = req.body;

//     client.messages.create({
//         body: message,
//         to: to,
//         from: env.TWILIO_SENDER  // Use the sender number from the environment file
//     })
//     .then((message) => res.status(200).send({ sid: message.sid }))
//     .catch((error) => res.status(500).send({ error: error.message }));
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });