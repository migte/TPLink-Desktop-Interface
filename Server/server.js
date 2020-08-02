// By - migte
// Special thanks to Academind for server creation information
const open = require('open');
const http = require('http');
const app = require('./app');

// Opens the HTML file
setTimeout(() => {
    (async () => {
        await open('Interface/index.html');
    })();
}, 1000);

// Port / localhost3000
const port = process.env.PORT || 3000
const server = http.createServer(app);

// Listen on localhost 3000
server.listen(port);

// Command Prompt message (research if its possible to have this run in the back)
console.log("\n/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#\n\nThis is a interface to access and change the state of your TP-Link smart bulbs\n\nDO NOT exit this console, as it will serve as the communication between your lightbulbs and your PC.\nYou are free to minimize it if you'd like\n\nEnjoy!\n\n/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/#/")




