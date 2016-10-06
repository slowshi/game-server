define([],function(){
	var JaipurService = function(GameUser,EventEmitter){
		return {
			user:GameUser,
			emitter:EventEmitter,
			players:[],
			playerHand:[],
			opponentId:null,
			opponentHand:[],
			market:[],
			deck:[],
			discard:[],
			tokens:[],
			registerUser:function(){
				console.log('userRegistered');
				this.user.socket.on('Jaipur:UpdateGameInfo',this.onUpdateGameInfo.bind(this));
				// this.user.socket.on('Jaipur:UpdateGameRooms',this.onUpdateGameRooms.bind(this));
				// this.user.socket.on('Jaipur:GameRoomCreated',this.onMakeGameRoom.bind(this));
				// this.user.socket.on('Jaipur:GameLoaded',this.onGameLoaded.bind(this));
				
				this.emitter.subscribe('Jaipur:Disconnect',this.onDisconnect.bind(this));
				this.user.socket.emit('Jaipur:PlayerReady');
			},
			getCardClass:function(card){
				var cardClass = 'cards ';
				if(card.user == this.opponentId || card.user == 'deck'){
					cardClass += 'back_card';
				}else{					
					cardClass += card.type + '_card';
				}
				return cardClass;
			},
			onUpdateGameInfo:function(data){
				console.log(data);
				this.players = data.players;
				this.playerHand = data[this.user.socketid];
				var filterOpponent = function(socketid){
					console.log(socketid,this.user.socketid);
					if(socketid !== this.user.socketid){
						return socketid;
					}
				};
				this.opponentId = this.players.filter(filterOpponent.bind(this))[0];
				this.opponentHand = data[this.opponentId];
				this.market = data.market;
				this.deck = data.deck;
				this.discard = data.discard;
				this.tokens = data.tokens;

				this.emitter.trigger('apply');
			},			
			onDisconnect:function(user){
				console.log('jaipurDisconnected');
				this.user.socket.removeAllListeners('Jaipur:UpdateGameInfo');
			},
		};
	};
	return JaipurService;
});