define([
  './reducer.js',
  ],
  function(reducer) {
  var ChatUserService = function(storeService) {
    storeService.addReducer('userList', reducer);
    var roomUsers = {};
    var gameUser = null;
    var socketid = null;
    var userSocket = null;
    var updateChatWindow = function updateChatWindow() {
      gameUser = storeService.store.getState().gameUser;
      updateRoomUsers();
    };
    storeService.store.subscribe(updateChatWindow);
    var onConnect = function onConnect() {
        socketid = gameUser.socketid;
        userSocket = gameUser.socket;
        var joinQuery = {
          room: 'lobby',
          socketid: socketid,
        };
        userSocket.emit('ChatServer:JoinRoom', joinQuery);
        userSocket.on('GameUser:UpdateUserList', updateUserList);
    };
    var onDisconnect = function(user) {
        var userSocket = gameUser.socket;
        userSocket.removeAllListeners('ChatServer:UpdateUserList');
    };

    var updateRoomUsers = function() {
      var userList = storeService.store.getState().userList;
      for(var i in gameUser.rooms) {
        roomUsers[gameUser.rooms[i]] = [];
      }
      for(var roomName in roomUsers) {
         for(var i in userList) {
          var userRooms = userList[i].rooms;
          for(var j in userRooms) {
            if(userRooms[j] === roomName) {
              roomUsers[roomName].push(userList[i]);
            }
          }
        }
      }
    };
    var updateUserList = function(data) {
      storeService.store.dispatch({
        type: 'updateUserList',
        userList: data,
      });
    };

    return {
      onConnect: onConnect,
      onDisconnect: onDisconnect,
      roomUsers: roomUsers,
    };
  };
  return ChatUserService;
});
