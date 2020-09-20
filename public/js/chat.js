const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#inputText')
const $messageFormButton = $messageForm.querySelector('button')
const $location = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $room = document.querySelector('#room')

const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const roomtemplate = document.querySelector('#room-template').innerHTML

const autoScroll = () => {

    // New message element
    const $newMessage = $messages.lastElementChild
    
    // Get the height of the newest message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
    console.log('Message size', newMessageHeight)

    // Visible height
    const visibleHeight = $messages.offsetHeight
    console.log('Visible height', visibleHeight)

    // Height of messages container
    const containerHeight = $messages.scrollHeight
    console.log('Container height', containerHeight)

    console.log(containerHeight-visibleHeight)

    // How far we have scrolled down
    const scrollOffset = $messages.scrollTop + visibleHeight
    console.log('Scrolltop', scrollOffset)

    if (containerHeight - visibleHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

// Message template
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.message,
        createdAt: moment(message.createdAt).format('h:mm:ss a'),
        username: message.username,
        room: message.room
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Location template
socket.on('locationMessage', (data) => {

    const html = Mustache.render(urlTemplate, {
        location: data.location,
        time: moment(data.createdAt).format('h:mm:ss a'),
        username: data.username,
        room: data.room
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

//Room template
socket.on('room', ({room, users}) => {

    const html = Mustache.render(roomtemplate, {
        room,
        users
    })
    $room.innerHTML = html
})

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')    
    var message = e.target.elements.message.value
    
    if (!message) {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        return alert('Please write something before sending any message!')
    }
   
    socket.emit('sendMessage', {
        message: message,
        username: username,
        room: room
    }, (error) => { 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered')
    })    
})

$location.addEventListener('click', (e) => {
    e.preventDefault()
    $location.setAttribute('disabled', 'disabled')

  if(!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => { 
        socket.emit('getCoordinates', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            username: username,
            room: room
        }, () => {
            $location.removeAttribute('disabled')
        })
    })
})

// socket.on('disconnect', () => {
//     console.log('User disconnected -> ')
// })

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    } 
})