const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();

function sendFile(fileName, waitTime = 0) {
    return (_, response) => {
        setTimeout(() => {
            fs.access(fileName, fs.constants.R_OK, (error) => {
                if (error) {
                    response.status(404).send({ error: 'File not found!' })
                }
                response.sendFile(path.resolve(__dirname, fileName));
            });
        }, waitTime);
    }
}

const routes = [
    {
        path: '/index.html',
        fileName: 'index.html',
        responseTime: 0,
    },
    {
        path: '/style.css',
        fileName: 'style.css',
        responseTime: 0,
    },
    {
        path: '/script.js',
        fileName: 'script.js',
        responseTime: 0,
    }
]

for (const route in routes) {
    const { path, fileName, responseTime } = routes[route];
    app.get(path, sendFile(fileName, responseTime));
}

app.listen(3000);
