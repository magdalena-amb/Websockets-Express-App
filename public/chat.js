//Make connection
// this socket is from front-end socket.io that's loaded in index.html
const socket = io.connect('http://localhost:4000');

//Query DOM
const message = document.querySelector('#message'),
      name = document.querySelector('#name'),
      btn = document.querySelector('#send'),
      output = document.querySelector('#output'),
      feedback = document.querySelector('#feedback');

// Emit events
btn.addEventListener('click', ()=> {
    //emits message down the socket to the server
    socket.emit('chat', {          // name of the message
        message: message.value,    // data
        name: name.value
    });
    message.value = '';
});

message.addEventListener('keypress', () => {
    socket.emit('typing', name.value);
});

// Listen for events
socket.on('chat', (data) => {
    output.innerHTML += `<p><strong> ${data.name} &nbsp; </strong> ${data.message} </p>`
});

socket.on('typing', (data)=> {
    feedback.innerHTML = `<p> ${data} &nbsp; is typing a message </p>`;
})