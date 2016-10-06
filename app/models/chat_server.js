	var socketio = require('socket.io');
	var io;
	var guestNumber = 1;
	var nickNames = {};
	var namesUsed = [];
	var currentRoom = {};
	var currentGames = {};
	var gameid = new Date().getTime();
	var gameList = {};
	var Jaipur = new require('./jaipur_server');
	var room = 'Lobby';
	var chatLogs = [];

	module.exports = {
		io:null,
		chatRooms:{},
		room:'Lobby',
		chatLogs:[],
		gameUsers: require('./game_users.js'),
		registerIo:function(io, socket){
			this.io = io;
			socket.on('ChatServer:JoinRoom',this.joinRoom.bind(this));
			socket.on('ChatServer:SendMessage',this.onMessageSent.bind(this));
			socket.on('disconnect',this.onDisconnect);
		},
		onDisconnect:function(socket){
			console.log("User Has Left:",this.id);
			module.exports.leaveRoom(this.id);
		},
		joinRoom:function(data){
			var room = data.room;
			var socketid = data.socketid;
			var user = this.gameUsers.getServerUserInfo(socketid);
			user.socket.join('Lobby');
			console.log("User: "+ user.socket.id +" Has Entered:",room);
			if(this.chatRooms[room] == void 0){
				this.chatRooms[room] = {};
			}
			this.chatRooms[room][socketid] = this.gameUsers.getUserInfo(socketid);
			this.io.sockets.in(room).emit('ChatServer:UpdateUserList',{room:room, users: this.chatRooms[room]});
		},
		leaveRoom:function(socketid){
			for(var i in this.chatRooms){
				var room = this.chatRooms[i];
				if(this.chatRooms[i][socketid] !== void 0){
					delete this.chatRooms[i][socketid];
				}
				this.io.sockets.in(i).emit('ChatServer:UpdateUserList',{room:i, users: room});
			}
		},
		onMessageSent:function(message){
			var user = this.gameUsers.getUserInfo(message.socketid);
			for(var i in user){
				message[i] = user[i];
			}
			this.io.sockets.in(message.room).emit('ChatServer:RecieveMessage',message);
		}
	};

	return;

	exports.listen = function(server){
		io = socketio.listen(server);
		io.set('log level', 1);

		io.sockets.on('connection',function(socket){
			console.log("User Has Connected:",socket.id);
			guestNumber = assignGuestName(socket);
			joinRoom(socket);
			handleMessageBroadcasting(socket);
			// handleNameChangeAttempts(socket);
			// handleRoomJoining(socket);
			// handleCoinFlip(socket);
			// handleCreateGame(socket);
			// handleJoinGame(socket);
			// handleClientDissconnection(socket);
		});
	};

	function assignGuestName(socket){
		var name = 'Guest' + guestNumber;
		nickNames[socket.id] = name;
		socket.emit('nameResult',{success:true, name:name});
		namesUsed.push(name);
		return guestNumber + 1;
	}

	function joinRoom(socket){
		socket.join(room);
		var firstRoom = (!currentRoom[socket.id]) ? true : false;

		currentRoom[socket.id] = room;
		//io.sockets.in(room).emit('message',{text:nickNames[socket.id] + ' has joined ' + room + '.'});
		io.sockets.in(room).emit('updateUserList',{users:nickNames});
		io.sockets.in(room).emit('updateGameList',{gameList:gameList});
	}

	function handleNameChangeAttempts(socket){
		socket.on('nameAttempt',function(name){
			if(name.indexOf('Guest') == 0){
				socket.emit('nameResult', {success:false, message:'Name cannot begin with "Guest".'});
			}else{
				 if(namesUsed.indexOf(name) == -1){
				 	var previousName = nickNames[socket.id];
				 	var previousNameIndex = namesUsed.indexOf(previousName);
				 	namesUsed.push(name);
				 	nickNames[socket.id] = name;
				 	delete namesUsed[previousNameIndex];

				 	socket.emit('nameResult',{success:true, name:name});
				 	socket.broadcast.to(currentRoom[socket.id]).emit('message',{text:previousName + ' is now known as ' + name + '.'});
					io.sockets.in(room).emit('updateUserList',{users:nickNames});
				 }else{
				socket.emit('nameResult', {success:false, message:'Name is in use.'});
				}
			}
		});
	}
	function handleCoinFlip(socket){
		socket.on('coinFlip',function(coin){
			socket.broadcast.to(currentRoom[socket.id]).emit('message',{text:nickNames[socket.id] +' flipped a '+coin+'.'});
		})
	}
	function handleMessageBroadcasting(socket){
		socket.on('message',function(message){
			if(chatLogs[message.room] == void 0){
				chatLogs[message.room] = [];
			}
			chatLogs[message.room].push(message);
			io.sockets.in(message.room).emit('message',message);
			io.sockets.in(message.room).emit('apply',message);
			//socket.broadcast.to(message.room).emit('message',chatLogs);
		});
	}
	function handleCreateGame(socket){
		socket.on('createGameAttempt',function(data){
			for(var i in currentGames){
				var game = currentGames[i];
				for(var j in game){
					var playerSocket = game[j];
						if(playerSocket.id == socket.id){
							socket.emit('gameJoinResult',{success:false,message:'You are already in a game.'})
							return;
						}
				}
			}
			currentGames[gameid] = [];
			var userGame = currentGames[gameid];
				userGame.push(socket);
				gameList[gameid] = [];
				gameList[gameid].push(nickNames[socket.id]);
				io.sockets.in(room).emit('updateGameList',{gameList:gameList});
				socket.emit('gameJoinResult',{success:true,gameid:gameid,message:'You have joined the game in and are waiting for players.'})
			gameid++;
		});

	}
	function handleJoinGame(socket){
		socket.on('joinGameAttempt',function(data){
			var roomGame = currentGames[data.gameid];
			if(roomGame.length == 2){
				socket.emit('gameJoinResult',{success:false,message:'Game is Full.'})
			}else if(roomGame.length == 1 && roomGame[0] == socket){
				socket.emit('gameJoinResult',{success:false,message:'You are already in this game.'})
			}else{
				roomGame.push(socket);
				for(var i in roomGame){
					if(roomGame[i] == socket){
						var playerSocket = roomGame[i];
						var playerName = nickNames[socket.id];
						gameList[data.gameid].push(nickNames[socket.id]);
						playerSocket.emit('gameJoinResult',{success:true,message:'You have joined the game.'})
					}else{
						var opponentSocket = roomGame[i];
						var opponentName = nickNames[socket.id];
						opponentSocket.emit('gameJoinResult',{success:true,message: opponentName+' has joined the game.'})
					}
				}

				if(roomGame.length == 2){
					var newGame = new Jaipur(roomGame);
				}
				//cket.emit('gameJoinResult',{success:true,message:'You have joined the game in' + userRoom +'.'})
				//cket.broadcast.to(userRoom).emit('message',{text:nickNames[socket.id] +' joined game.'});
			}
		})
	}
	function handleRoomJoining(socket){
		socket.on('join',function(room){
			socket.leave(currentRoom[socket.id]);
			joinRoom(socket, room.newRoom);
		});
	}

	function handleClientDissconnection(socket){
		socket.on('disconnect',function(){
			var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
			
			for(var i in currentGames){
				var game = currentGames[i];
				var list = gameList[i];
				if(game.indexOf(socket) > -1){
					game.splice(game.indexOf(socket),1);
					list.splice(list.indexOf(nickNames[socket.id]),1);
					var gameid = i;
				}
				if(game.length == 0)
					delete currentGames[i];
				if(list.length == 0)
					delete gameList[i];
			}
			delete namesUsed[nameIndex];
			delete nickNames[socket.id]
			io.sockets.in(room).emit('updateUserList',{users:nickNames});
			io.sockets.in(room).emit('updateGameList',{gameList:gameList});
		});
	}
