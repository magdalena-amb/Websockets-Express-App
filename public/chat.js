//Query DOM
const message = document.querySelector('#message'),
      name = document.querySelector('#name'),
      btn = document.querySelector('#send'),
      output = document.querySelector('#output'),
      feedback = document.querySelector('#feedback'),
      status = document.querySelector('#status');

// Set default status
const statusDefault =  '';

const setStatus = (s) => {
    // set status
    status.innerText = s;
    if ( s !== statusDefault) {
        const delay = setTimeout(()=> setStatus(statusDefault), 4000);
    }
}

//Make connection
// this socket is from front-end socket.io that's loaded in index.html
const socket = io.connect('http://localhost:4000');

//Check for connection
if (socket !== undefined) {
    console.log('Connected to socket!');
    socket.on('output', (data) => {
        //console.log(data);
        if(data.length) {
            for(let x = 0; x < data.length; x++) {
                // Build out message div
                const message = `<p><strong> ${data[x].name} &nbsp; </strong> ${ data[x].message}</p>`
                output.insertAdjacentHTML("afterbegin", message);
                
            }
        }
    });

    socket.on('typing', (data)=> {
        feedback.innerHTML = `<p> ${data} &nbsp; is typing a message </p>`;
        });

    //handle input
    btn.addEventListener('click', ()=> {
    //emits message down the socket to the server
    socket.emit('input', {          // name of the message
        message: message.value,    // data
        name: name.value
    });
    message.value = '';
    });

    // broadcasting typing status
    message.addEventListener('keypress', (e) => {
        //e.preventDefault();
        socket.emit('typing', name.value);

        if (e.which == 13 || e.keyCode == 13) {
            socket.emit('input', {          
                message: message.value,    
                name: name.value
            });
            message.value = '';
        };
    }); 
           
    



    // Get Status from server
    socket.on('status', (data)=>{
        //get message status
        setStatus((typeof data === 'object') ? data.message : data ); 

        //if status is clear, clear text
        if(data.clear) {
            status.value = '';
        }
    })
}

