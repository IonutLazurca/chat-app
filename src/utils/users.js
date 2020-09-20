let users = []


// addUser, removeUser, getUser, getUsersInRoom

function Users(username, room, message, createdAt) {
    this.username = username,
    this.room = room,
    this.message = message,
    this.createdAt = createdAt
}

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate data
    if (!username || !room)
    return {
        error: 'Username and room are required'
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'Username already exists'
        }
    }
    
    //Store user
    const user = {
        id: id,
        username: username,
        room: room
    }
    users.push(user)
    return {user}
}

// const removeUser = (user) => {

//     if (!user){
//         return {
//             error: 'Please provide an user to remove'
//         }
//     }
//     username = user.username.trim().toLowerCase() 
//     users = users.filter(element => element.username !== username)

//     return users
// }

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index != -1) {
        return users.splice(index, 1)[0]

    }
}

const getUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index != -1) {
        return users[index]
    }
    return undefined
}

const getUsersInRoom = (room) => {

    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)    
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}