//js code required before joining or creating  a  room.
//e.g. get rooms list to show the user
const socket = io ()
const $rooms = document.querySelector('#rooms-dropdown')




socket.on ('roomsMessage', (message) => {
    console.log( message)  
    message.forEach( (room) => {
        const html = '<option value=\"' + room + '\">' + room + '</option>'
        $rooms.insertAdjacentHTML('beforeend', html)
    })
})



socket.emit('Rooms',  (error)  => {
    if (error){
        alert(error)
        location.href='/'
    }
})