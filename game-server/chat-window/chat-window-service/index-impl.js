define(['redux'], function(Redux) {
  var ChatWindowService = function(EventEmitter, GameUser) {
    /**
     * Store callback
     * @param {Object} state
     * @param {Object} action
     * @return {Object}state
     */
    function updateChatStore(state, action) {
      if (typeof state === 'undefined') {
        state = {
          chatLog: [],
          chatList: [],
          chatRooms: [],
        };
      }

      switch (action.type) {
        case 'recieveMessage':
          state.chatLog.push(action.message);
        break;
        case 'updateUserList':
          state.chatRooms[action.room] = action.userList;
        break;
      }
      return state;
    }

    var chatStore = Redux.createStore(updateChatStore);
    /**
     *  render
     */
    function forceApply() {
      EventEmitter.trigger('apply');
    }
    forceApply();
    chatStore.subscribe(forceApply);
    return {
      emitter: EventEmitter,
      user: GameUser,
      chatLog: chatStore.getState().chatLog,
      chatList: [],
      chatRooms: chatStore.getState().chatRooms,
      registerUser: function() {
        var socketid = this.user.socket.socket.sessionid;
        this.emitter.subscribe('GameUser:Disconnected', this.onDisconnect.bind(this));
        this.user.socket.on('ChatServer:RecieveMessage', this.recieveMessage.bind(this));
        this.user.socket.on('ChatServer:UpdateUserList', this.updateUserList.bind(this));
        var joinQuery = {
          room: 'Lobby',
          socketid: socketid,
        };
        this.user.socket.emit('ChatServer:JoinRoom', joinQuery);
      },
      onDisconnect: function(user) {
        this.user.socket.removeAllListeners('ChatServer:RecieveMessage');
        this.user.socket.removeAllListeners('ChatServer:UpdateUserList');
      },
      updateChatLog: function(message) {
        chatStore.dispatch({
          type: 'recieveMessage',
          message: message,
        });
      },
      onCheckImage: function(message, res) {
        if (res == 'success') {
          message.type = 'image';
        }
      },
      recieveMessage: function(message) {
        this.updateChatLog(message);
        if (message.type == 'url') {
          this.checkImage(message, this.onCheckImage.bind(this));
        }
      },
      updateUserList: function(data) {
        chatStore.dispatch({
          type: 'updateUserList',
          room: data.room,
          userList: data.users,
        });
      },
      sendMessage: function(text) {
        if (text === '') return;
        if (text.substring(0, 2) == '!~') {
          var champStr = text.substr(2);
          this.user.getChampion(champStr);
        }
        var type = '';
        if (this.validURL(text)) {
          type = 'url';
          if (this.checkYouTube(text)) {
            type = 'video';
            text = 'https://www.youtube.com/embed/' + this.checkYouTube(text);
          } else {
            text = this.addHttp(text);
          }
        }
        var obj = {
          room: 'Lobby',
          text: text,
          type: type,
          socketid: this.user.socketid,
          time: new Date().getTime(),
        };
        this.user.socket.emit('ChatServer:SendMessage', obj);
      },
      getTimeSince: function(time) {

      },
      validURL: function(str) {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var pattern = new RegExp(expression);
        if (!pattern.test(str)) {
          return false;
        } else {
          return true;
        }
      },
      addHttp: function(text) {
        var result;
        var startingUrl = 'http://';
        var httpsStartingUrl = 'https://';
        if (text.indexOf(startingUrl) === 0 || text.indexOf(httpsStartingUrl) === 0) {
          result = text;
        } else {
          result = startingUrl + text;
        }
        return result;
      },
      checkYouTube: function(url) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
          return match[2];
        } else {
          // error
        }
      },
      checkImage: function(message, callback, timeout) {
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
      },
    };
  };
  return ChatWindowService;
});
