const rooms = [''] 


const addRoom = (room) =>{
    // Clean the data
    room    = room.trim().toLowerCase()

    //validate the data
    if (!room) {
        return {
            error: ' room is required'
        }
    }

    // Check for existing room
    if (rooms.includes (room))
        return room

    // Store room
    rooms.push(room)
    return room
}

const getAllRooms = () =>
{
    return rooms
}

// const res = addRoom('haifa')
// const res2 = addRoom('Afula')
// const res3 = addRoom('haifa')
// const res4 = addRoom('Afula')
//console.log(rooms)



module.exports= {
    addRoom,
    getAllRooms
}