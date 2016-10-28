define(['./reducer.js'],
  function(reducer) {
  var ChatWindowService = function(storeService) {
    storeService.addReducer('chatWindow', reducer);
    var socketid = null;
    var userSocket = null;
    var onConnect = function onConnect() {
        socketid = storeService.store.getState().gameUser.socketid;
        userSocket = storeService.store.getState().gameUser.socket;
        var joinQuery = {
          room: 'Lobby',
          socketid: socketid,
        };
        userSocket.emit('ChatServer:JoinRoom', joinQuery);
        userSocket.on('ChatServer:RecieveMessage', recieveMessage);
        userSocket.on('ChatServer:UpdateUserList', updateUserList);
    };
    var onDisconnect = function(user) {
          userSocket.removeAllListeners('ChatServer:RecieveMessage');
          userSocket.removeAllListeners('ChatServer:UpdateUserList');
    };
    var updateChatLog = function(message) {
      storeService.store.dispatch({
        type: 'recieveMessage',
        message: message,
      });
    };
    var onCheckImage = function(message, res) {
      if (res == 'success') {
        message.type = 'image';
      }
    };
    var recieveMessage = function(message) {
      updateChatLog(message);
      if (message.type == 'url') {
        checkImage(message, onCheckImage);
      }
    };
    var updateUserList = function(data) {
      storeService.store.dispatch({
        type: 'updateUserList',
        room: data.room,
        userList: data.users,
      });
    };
    var sendMessage = function(text) {
      if (text === '') return;
      if (text.substring(0, 2) == '!~') {
        var champStr = text.substr(2);
        storeService.store.dispatch({
          type: 'setAvatar',
          avatar: champStr,
        });
        userSocket.emit('GameUser:ChangeAvatar', champStr);
      }
      var type = '';
      if (validURL(text)) {
        type = 'url';
        if (checkYouTube(text)) {
          type = 'video';
          text = 'https://www.youtube.com/embed/' + checkYouTube(text);
        } else {
          text = addHttp(text);
        }
      }
      var obj = {
        room: 'Lobby',
        text: text,
        type: type,
        socketid: socketid,
        time: new Date().getTime(),
      };
      userSocket.emit('ChatServer:SendMessage', obj);
    };

    var validURL = function(str) {
      var expression = 
      /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      var pattern = new RegExp(expression);
      if (!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
    };
    var addHttp = function(text) {
      var result;
      var startingUrl = 'http://';
      var httpsStartingUrl = 'https://';
      if (text.indexOf(startingUrl) === 0 || 
        text.indexOf(httpsStartingUrl) === 0) {
        result = text;
      } else {
        result = startingUrl + text;
      }
      return result;
    };
    var checkYouTube = function(url) {
      var regExp =
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
      } else {
        // error
      }
    };
    var checkImage = function(message, callback, timeout) {
      timeout = timeout || 5000;
      var url = message.text;
      var timedOut = false;
      var timer = null;
      var img = new Image();
      img.onerror = img.onabort = function() {
        if (!timedOut) {
          clearTimeout(timer);
          callback(message, 'error');
        }
      };
      img.onload = function() {
        if (!timedOut) {
          clearTimeout(timer);
          callback(message, 'success');
        }
      };
      img.src = url;
      timer = setTimeout(function() {
        timedOut = true;
        callback(message, 'timeout');
      }, timeout);
    };

    return {
      onConnect: onConnect,
      onDisconnect: onDisconnect,
      sendMessage: sendMessage,
    };
  };
  return ChatWindowService;
});
