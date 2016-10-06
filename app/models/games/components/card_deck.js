function Deck(cards){
	this.cards = cards;
	this.users = [];
	return this;
}
Deck.prototype = {
	registerUsers:function(users){
		var addedUsers = this.users.concat(users);
		this.users = addedUsers;
	},
	dealCards:function(count,users,alternate){
		alternate = alternate || true;
		var totalDealt = count * users.length;
		var userArr = users;
		while(totalDealt > 0){
			var user = userArr.shift();
			this.drawRandomCard(user,'deck');
			userArr.push(user);
			totalDealt--;
		}
	},
	drawRandomCard:function(to,from){
		to = to || 'deck';
		from = from || 'deck';
		if(!this.isValidUser(to))console.log('drawRandomCard: to invalid.');
		if(!this.isValidUser(from))console.log('drawRandomCard: from invalid.');
		var drawPile = this.getCardsByUser(from);
		if(drawPile.length > 0){
			var cardIndex = Math.floor(Math.random()*drawPile.length);
			drawPile[cardIndex].user = to;
		}
		return cardIndex;
	},
	moveCardById:function(id,to){
		var card = this.getCardById(id);
		card.user = to;
	},
	collectCards:function(from,to){
		if(!this.isValidUser(from))console.log('moveCards: from user invalid.');
		if(!this.isValidUser(to))console.log('moveCards: to user invalid.');

		var fromPile = this.getCardsByUser(from);
		var collectCards = function(cardObj){
			return cardObj.user = to;
		}
		fromPile.map(collectCards);
	},
	getCardsByUser:function(user){
		if(!this.isValidUser(user))console.log('getCardsByUser: user invalid.');
		var getCardsByUser = function(cardObj){
			if(cardObj.user == user){
				return cardObj;
			}
		}
		var userCards = this.cards.filter(getCardsByUser);
		return userCards;
	},
	getCardById: function(id){
		var getCardById = function(cardObj){
			if(cardObj.id == id){
				return cardObj;
			}
		}
		var card = this.cards.filter(getCardById);
		return card[0];
	},
	getCardsByType:function(type,user){
		if(!this.isValidUser(user))console.log('getCardsByType: user invalid.');
		var hasUser = (user != void 0) ? true : false;
		var getCardsByType = function(cardObj){
			if((hasUser && cardObj.user == user && cardObj.type == type) || (!hasUser && cardObj.type == type)){
				return cardObj;
			}
		}		
		var cardTypes = this.cards.filter(getCardsByType);
		return cardTypes;
	},
	isValidUser:function(user){
		return this.users.indexOf(user) > -1;
	},
};

module.exports = Deck;