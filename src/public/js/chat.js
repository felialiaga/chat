const socket = io({
    autoConnect: false
});
const chatBox = document.getElementById('chatBox');
let username;



Swal.fire({

    title: 'Identificate',
    icon: 'question',
    input: 'text',
    inputValidator: (value) => {
        if(!value) {
            return 'You need a username'
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false

}).then(res => {
    username = res.value;
    socket.connect();
    socket.emit('authenticated', username);
})



chatBox.addEventListener('keyup', (e) => {

    if(e.key === 'Enter') {

        if(chatBox.value.trim()) {
            socket.emit('message', {username: username, message: chatBox.value.trim()});

            chatBox.value = "";
        } 
 
    }

});


socket.on('log', data => {

    const messagesLog = document.getElementById('messagesLog');
    let messages = '';

    data.forEach( (logItem) => {

        messages+= `${logItem.username} dice: ${logItem.message} <br/> `

    });

    messagesLog.innerHTML = messages;
})


socket.on('newUserConnected', data => {
    if(!username) return;
    Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido`,
        icon: 'success',
        position: 'top-end'
    })
});