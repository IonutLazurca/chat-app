const generateMessage = (message) => {
    return {
        message: message.message,
        createdAt: new Date().getTime(),
        username: message.username,
        room: message.room
    }
}

const generateWelcomeMessage = (message) => {
    return {
        message: `logged in`,
        createdAt: new Date().getTime(),
        username: message.username,
        room: message.room
    }
}


const generateLogoutMessage = (message) => {
    return {
        message: `has left the room`,
        createdAt: new Date().getTime(),
        username: message.username,
        room: message.room
    }
}

const generateLocationMessage = (coords) => {
    return {
        location: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt: new Date().getTime(),
        username: coords.username,
        room: coords.room
    }
}

module.exports = {
    generateMessage: generateMessage,
    generateLocationMessage: generateLocationMessage,
    generateWelcomeMessage: generateWelcomeMessage,
    generateLogoutMessage: generateLogoutMessage

}