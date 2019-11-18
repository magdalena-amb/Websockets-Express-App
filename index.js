const express = require('express');
const app = express();
const socket = require('socket.io');


const server = app.listen( 4000, ()=>{ console.log('Listening to requests on port 4000')});

// Static files
app.use(express.static('public'));

// Socket setup
const io = socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id)

    // handles messages coming from client (data)
    socket.on('chat', (data)=> {
        // socket.emit refers to all the sockets connected on the server
        io.emit('chat', data);
    });

    socket.on('typing', (data)=>{
        // socket.broadcast.emit refers to this one individual socket that's typing the message
        socket.broadcast.emit('typing', data);
    });
});