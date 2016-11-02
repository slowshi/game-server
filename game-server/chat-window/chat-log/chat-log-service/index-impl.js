define([
  './reducer.js',
  ],
  function(reducer) {
  var ChatWindowService = function(storeService) {
    storeService.addReducer('chatLog', reducer);
    var chatLog = {};
    var gameUser = null;
    var socketid = null;
    var userSocket = null;
    var updateChatWindow = function updateChatWindow() {
      gameUser = storeService.store.getState().gameUser;
      updateChatLog();
    };
    storeService.store.subscribe(updateChatWindow);
    var onConnect = function onConnect() {
        socketid = gameUser.socketid;
        userSocket = gameUser.socket;
        userSocket.on('ChatServer:RecieveMessage', recieveMessage);
    };
    var onDisconnect = function(user) {
        var userSocket = gameUser.socket;
        userSocket.removeAllListeners('ChatServer:RecieveMessage');
    };
    var updateChatLogStore = function(message) {
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
      updateChatLogStore(message);
      if (message.type == 'url') {
        checkImage(message, onCheckImage);
      }
    };
    var updateChatLog = function() {
      var chatLogStore = storeService.store.getState().chatLog;
      for(var i in gameUser.rooms) {
        if(chatLog[gameUser.rooms[i]] === void 0) {
          chatLog[gameUser.rooms[i]] = [];
        }
      }
      for(var k in chatLogStore) {
        chatLogStore[k].isUser = chatLogStore[k].socketid === socketid;
        chatLogStore[k].avatar = gameUser.avatar;
        chatLogStore[k].name = gameUser.name;
        chatLog[chatLogStore[k].room].push(chatLogStore[k]);
      }
    };
    var checkAvatar = function(text) {
      if (text.substring(0, 2) == '!~') {
        var champStr = text.substr(2);
        storeService.store.dispatch({
          type: 'setAvatar',
          avatar: champStr,
        });
        var userInfo = {
          avatar: champStr,
          socketid: socketid,
        };
        userSocket.emit('GameUser:SetUserInfo', userInfo);
      }
    };
    var sendMessage = function(text) {
      if (text === '') return;
      checkAvatar(text);
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
        room: 'lobby',
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
      chatLog: chatLog,
      sendMessage: sendMessage,
    };
  };
  return ChatWindowService;
});
