const express = require('express');
const app = express();
const socket = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
const path = require('path')
const PORT = process.env.PORT || 4000;
const INDEX = '/public/index.html';



const server = app.use(express.static(__dirname + '/public/'))
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening to requests on ${PORT}`));

 // Socket setup
 const io = socket(server);
 
// Connection URL
const url = process.env.MONGODB_URI||'mongodb://localhost:27017';
 
// Database Name
const dbName = 'mongoChat';

// Use connect method to connect to the server
MongoClient.connect(url,
    { useUnifiedTopology: true }, 
    function(err, client) {
        if(err){ throw err; }

        console.log("Connected successfully to Mongo DB...");
    
        const db = client.db(dbName);

        // Connect to Socket.io
        io.on('connection', (socket) => {
            console.log('made socket connection', socket.id)
            socket.on('disconnect', () => console.log('Client disconnected'));

            // Get the chat DB collection
            const chat = db.collection('chat');

            // Create function to send status
            sendStatus = function(s) {
                socket.emit('status', s);
            }

            // Get chats from mongo collection
            chat.find().limit(50).sort({_id:1}).toArray((err, res)=>{
                if(err){
                    throw err;
                }
                //Emit the messages
                io.emit('output', res);
            });

            //Handle input events
            socket.on('input', (data)=>{

                let name = data.name;
                let message = data.message;

                // Check for name and message
                if (name == '' || message == ''){
                    sendStatus('Please enter a name and message');
                } else {
                    // Insert message
                    chat.insertOne({ 
                        name:name,
                        message:message
                        },
                        ()=> {
                        io.emit('output', [data]);

                        // Send status object
                        sendStatus({
                            message: 'Message sent',
                            clear: true
                        });
                    });
                }
            });

            socket.on('typing', (data)=>{
            // socket.broadcast.emit refers to this one individual socket that's typing the message
            socket.broadcast.emit('typing', data);
            });
        })  
    });

    
        



