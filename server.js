const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();
app.use(express.static('dist')); // folder z plikami

const IPV4 = '192.168.1.109'
const PORT = 3032

const options = {
    key: fs.readFileSync(`${IPV4}-key.pem`),
    cert: fs.readFileSync(`${IPV4}.pem`)
};

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server działa na https://${IPV4}:${PORT}`);
});
