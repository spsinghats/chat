var ChatRoom = require('./chatRoom');

module.exports = function(io) {
    var rooms = {};

    io.on('connection', function (socket) {
        console.log("---------Connected-----------");
        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            socket.to(socket.room).broadcast.emit('new message', {
                username: socket.username,
                message: data
            });
        });
        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (user) {
            // TODO: handle empty room name from client.
            if (!rooms[user.room]) {
                // room doesnt exist , add the room
                rooms[user.room] = new ChatRoom(user.room);
            }
            var chatRoom = rooms[user.room];
            
            // we store the username in the socket session for this client
            socket.username = user.username;
            socket.room = user.room;
            // Add the user to room
            if(chatRoom.addUser(user.username)) {
                var numUsers = chatRoom.getUserCount();
                socket.join(user.room);
                socket.emit('login', {
                    numUsers: numUsers
                });
                // echo globally (all clients) that a person has connected
                socket.to(user.room).broadcast.emit('user joined', {
                    username: socket.username,
                    numUsers: numUsers
                });
            }
            else{
                socket.emit('userExists', user.username + ' username is taken! Try some other username.');
                return;
            }
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
                socket.to(socket.room).broadcast.emit('typing', {
                    username: socket.username
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
            socket.to(socket.room).broadcast.emit('stop typing', {
            username: socket.username
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
             var chatRoom = rooms[socket.room];
             if (chatRoom) {
                chatRoom.removeUser(socket.username);
                // echo globally that this client has left
                socket.to(socket.room).broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: chatRoom.getUserCount()
                });
             }
        });
    });
}