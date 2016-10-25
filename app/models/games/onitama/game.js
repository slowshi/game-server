var Deck = new require('../components/card_deck.js');
var Cards = new require('./cards.js');
var Tokens = new require('./tokens.js');
function Onitama(sockets){
	this.sockets = sockets;
	this.players = [];
	this.usersReady = 0;
	this.users = ['market','deck','discard'];
	this.registerUsers();
	this.deck = new Deck(new Cards());
	console.log(this.deck);
	this.tokens = new Deck(new Tokens());
	return this;
}
Onitama.prototype = {
	registerUsers:function(){
		var getSocketIds = function(socket){
			return socket.id;
		}
		this.players = this.sockets.map(getSocketIds);
		var concatUsers = this.users.concat(this.players);
		this.users = concatUsers;
		this.socketsOn('Onitama:PlayerReady',this.checkPlayersReady.bind(this));
	},
	checkPlayersReady:function(){
		this.usersReady++;
		if(this.usersReady == this.sockets.length){
			this.setupBoard();
		}
	},
	setupBoard:function(){
		console.log("SETUPBOARD IS CALLED HERE");
		this.deck.registerUsers(this.users);
		this.tokens.registerUsers(this.players);
		var camels = this.deck.getCardsByType('camel','deck');
		var i = 0;
		while(i<3){
			this.deck.moveCardById(camels[i].id,'market');
			i++;
		}
		this.deck.dealCards(2,['market']);
		this.deck.dealCards(6,this.players);
		this.socketsEmit('Onitama:UpdateGameInfo',this.gameInfo());
	},
	getSocketById:function(id){
		var socketById = function(socket){
			if(socket.id == id){
				return socket;
			}
		}
		var socketArr = this.sockets.filter(socketById);
		return socketArr[0];
	},
	socketsEmit:function(event,info){
		for(var i in this.sockets){
			var socket = this.sockets[i];
			socket.emit(event,info);
		}
	},
	socketsOn:function(event,callback){
		for(var i in this.sockets){
			var socket = this.sockets[i];
			socket.on(event,callback.bind(this));
		}
	},
	gameInfo:function(){
		var obj = {};
		obj.tokens = this.tokens.cards;
		obj.players = this.players;
		var dividedCards = function(user){
			obj[user] = this.deck.getCardsByUser(user);
		};
		this.deck.users.map(dividedCards.bind(this));
		return obj;
	}
};

module.exports = Onitama;
