const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage, generateWelcomeMessage, generateLogoutMessage} = require('../src/utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('../src/utils/users')

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

const server = http.createServer(app)
const io = socketio(server)


io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.on('join', ({username, room}, callback) => {

        const {error, user} = addUser({id: socket.id, username, room})

        if(error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage({message: `Welcome ${user.username}`}))
        socket.broadcast.to(user.room).emit('message', generateWelcomeMessage(user))

        io.to(user.room).emit('room', {
            room: user.room,
            users: getUsersInRoom(user.room)
        } )
        
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message.message)) {
            return callback('Profanity is not allowed')
        }        
        io.to(user.room).emit('message', generateMessage(message))
        callback()  
    })

    socket.on('getCoordinates', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(coords))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateLogoutMessage(user))
            io.to(user.room).emit('room', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })  
})

server.listen(port, () => {
    console.log('Server is running on port -> ' + port)
    
})