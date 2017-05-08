function ChatRoom (name) {
    this.name = name;
    this.users = [];

    this.getInfo = function() {
        return '';
    };
}

ChatRoom.prototype.addUser = function (username) {
    if(this.users.indexOf(username) == -1) {
        this.users.push(username);
        return true;
    }
    else {
        return false;
    }
}

ChatRoom.prototype.removeUser = function (username) {
    var index = this.users.indexOf(username);
    if(index != -1) {
        this.users.splice(index, 1);;
        return true;
    }
    else {
        return false;
    }
}

ChatRoom.prototype.getUserCount = function () {
    return this.users.length;
}

module.exports = ChatRoom;