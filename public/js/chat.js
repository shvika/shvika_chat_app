
const socket = io ()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
let { username, room, roomselection} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () =>{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle ($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height 
    const visibleHeight = $messages.offsetHeight

    // Height of messages container 
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

    console.log(newMessageMargin)


}

socket.on ('message', (message) => {
    console.log( message)  
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format ('H:MM:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on ('locationMessage', (message) => {
    console.log( message)  
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format ('H:MM:ss')
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
    
socket.on ('roomData', ({room, users}) =>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
} )

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = e.target.elements.message.value
    // console.log(`messsage sent:${message}` )

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})   



$locationButton.addEventListener('click', () => {

    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition ((position)=>{
        
        socket.emit ('sendLocation', 
            {latitude: position.coords.latitude, 
             longitude: position.coords.longitude},
             () =>{
                $locationButton.removeAttribute('disabled')
                 console.log('Location shared!')
             }
             )
    })

})

if (room==='' && roomselection===''){
    location.href = '/'
    const error =  'Room must be selected from list or entered manually'
    alert(error)
    throw new Error(error)
}else {

    if (room === ''){
        room = roomselection //becasue room is what's being sent to server 
    }
}

socket.emit('join', {username, room}, (error)  => {
    console.log(username, room, roomselection)
    if (error){
        alert(error)
        location.href='/'
    }
})
