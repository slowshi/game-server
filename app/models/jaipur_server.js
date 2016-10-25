var Jaipur = function(players) {
	this.players = players;
	this.cards = {
		'diamond':6,
		'gold':6,
		'silver':6,
		'silk':8,
		'spice':8,
		'leather':10,
		'camel':11
	};
	this.tokens = {
		'diamond':[7,7,5,5,5],
		'gold':[6,6,5,5,5],
		'silver':[5,5,5,5,5],
		'silk':[5,3,3,2,2,1,1],
		'spice':[5,3,3,2,2,1,1],
		'leather':[4,3,2,1,1,1,1,1,1],
		'combo_3':[3,3,2,2,2,1,1],
		'combo_4':[6,6,5,5,4,4],
		'combo_5':[10,10,9,9,8]
	};
	this.allCards = [];
	this.allTokens = [];

	this.events();
	this.gameInit();
}

Jaipur.prototype.gameInit = function() {
	/*
		var obj = {
			cardid: cardid,
			type:index,
			holder:'deck'
			selected:false
		}
		
	*/
	var cardid = 1;
	for(var index in this.cards) {
		var count = this.cards[index];
		var i = 0;
		while(i < count) {
			var obj = {
				cardid: cardid,
				type:index,
				holder:'deck',
				selected:false
			}
			if(index == 'camel' && i < 3) {
				obj.holder = 'market';
			}
			this.allCards.push(obj);
			i++;
			cardid++;
		}
	}
	/*
		var obj = {
			tokenid:tokenid,
			type:index,
			value:this.tokens[index]
			holder:'market'
		}
	*/
	var tokenid = 1;
	for(var index in this.tokens) {
		var tokensType = this.tokens[index];
		var i = 0;
		for(var toks in tokensType) {
			var obj = {
				tokenid:tokenid,
				type:index,
				value:tokensType[toks],
				holder:'market'
			}
			this.allTokens.push(obj);
			i++;
			tokenid++;
		}
	}
	//display market
	this.drawCard(2,'market');

	//deal cards
	var i = 0;
	var bool = false;
	while(i < 10) {
		if(bool) {
			var randCard = this.drawCard(1,'player1');
		}else{
			var randCard = this.drawCard(1,'player2');
		}

		bool = !bool;
		i++;
	}
	this.players[0].emit('gameStartup',this.getInfo(true));
	this.players[1].emit('gameStartup',this.getInfo(false))
}

Jaipur.prototype.events = function() {
	for(var i in this.players) {
		this.players[i].objref = this;
		this.players[i].on('takeGood',function(info) {
			this.objref.takeGood(info);
		});		
		this.players[i].on('tradeGoods',function(info) {
			this.objref.tradeCards(info);
		});
		this.players[i].on('sellGoods',function(info) {
			this.objref.sellCards(info);
		});
	}
}

Jaipur.prototype.takeGood = function(info) {
	for(var i in info.cardids) {
		this.giveCards(info.cardids[i], info.playerid);
	}
	var cards = this.drawCard(info.cardids.length);
		this.dispatchToPlayers('updateMarket',{enemyCards:info.cardids, playerid:info.playerid, marketCards:cards,msg:info.msg});
	if(cards.length < info.cardids.length)
		this.endRound();
}

Jaipur.prototype.tradeCards = function(info) {
// camels or one card and draw a card
	for(var i in info.givePlayer) {
		this.giveCards(info.givePlayer[i], info.playerid);
	}	
	for(var i in info.giveMarket) {
		this.giveCards(info.giveMarket[i], 'market');
	}
	var enemyCards = this.getCardIdsByHolder(info.playerid);
	var marketCards = this.getCardIdsByHolder('market');
	this.dispatchToPlayers('updateMarket',{enemyCards:enemyCards, playerid:info.playerid, marketCards:marketCards,msg:info.msg});
}

Jaipur.prototype.sellCards = function(info) {
//give player tokens and check for bonuses
	var tokenids = [];
	for(var i in info.goods) {
		this.giveCards(info.goods[i], 'sold');
		var type = this.getCardById(info.goods[i]).type;
		var tokenid = this.giveTokens(type);
		if(tokenid > 0)
			tokenids.push(tokenid)
	}

	if(info.goods.length == 3) {
		var tokenid = this.giveTokenBonus('combo_3');
		if(tokenid > 0)
			tokenids.push(tokenid)
	}else if(info.goods.length == 4) {
		var tokenid = this.giveTokenBonus('combo_4');
		if(tokenid > 0)
			tokenids.push(tokenid)
	}else if (info.goods.length > 4) {
		var tokenid = this.giveTokenBonus('combo_5');
		if(tokenid > 0)
			tokenids.push(tokenid)
	}

	this.dispatchToPlayers('updateSell',{tokens:tokenids, soldCards:info.goods, playerid:info.playerid,msg:info.msg});
	this.checkEnoughGoods();
}

Jaipur.prototype.playerLeave = function() {

}

Jaipur.prototype.dispatchToPlayers = function(event,info) {
	for(var i in this.players) {
		var player = this.players[i];
		player.emit(event,info);
	}
}
Jaipur.prototype.getCardById = function(id) {
	for(var i in this.allCards) {
		if(this.allCards[i].cardid == id) {
			return this.allCards[i];
		}
	}
}

Jaipur.prototype.getCardsByHolder = function(holder) {
	var holderCards = [];
	for(var i in this.allCards) {
		var cardObj = this.allCards[i];
		if(cardObj.holder == holder)
			holderCards.push(cardObj);
	}
	return holderCards;
}

Jaipur.prototype.giveCards = function(cardid,to) {
	for(var i in this.allCards) {
		var cardObj = this.allCards[i];
		if(cardObj.cardid == cardid) {
			if(to == 'sold') {
				var soldCards = this.getCardsByHolder('sold');
					cardObj.sellid = soldCards.length;
			}
			cardObj.holder = to;
		}
	}
}

Jaipur.prototype.getCardIdsByHolder = function(holder) {
	var cardids = [];
	for(var i = this.allCards.length-1; i > -1; i--) {
		var cardObj = this.allCards[i];
		if(cardObj.holder == holder)
			cardids.push(cardObj.cardid);
	}
	return cardids;
}

Jaipur.prototype.drawCard = function(count,holder) {
	if(count === void 0) count = 1;
	if(holder === void 0) holder = 'market';
	var i = 0;
	var cardids = [];
	while(i < count) {
		var drawPile = this.getCardsByHolder('deck');
		if(drawPile.length > 0) {
			var cardIndex = Math.floor(Math.random()*drawPile.length);
				drawPile[cardIndex].holder = holder;
				cardids.push(drawPile[cardIndex].cardid);
		}
		i++;
	}
	return cardids;
}
Jaipur.prototype.getMarketTokensByType = function(type) {
	var holderTokens = [];
	for(var i in this.allTokens) {
		var tokenObj = this.allTokens[i];
		if(tokenObj.holder == 'market' && tokenObj.type == type)
			holderTokens.push(tokenObj);
	}
	return holderTokens;
}
Jaipur.prototype.giveTokens = function(type,to) {
	for(var i in this.allTokens) {
		var tokenObj = this.allTokens[i];
		if(tokenObj.type == type) {
			if(tokenObj.holder == 'market') {
				tokenObj.holder = to;
				return tokenObj.tokenid;
			}
		}
	}
	return 0;
}

Jaipur.prototype.giveTokenBonus = function(type,to) {
	var bonusTokens = [];
	for(var i in this.allTokens) {
		var tokenObj = this.allTokens[i];
		if(tokenObj.type == type) {
			if(tokenObj.holder == 'market') {
				bonusTokens.push(tokenObj);
			}
		}
	}
	if(bonusTokens.length > 0) {
		var tokenIndex = Math.floor(Math.random()*bonusTokens.length);
			bonusTokens[tokenIndex].holder = to;
			return bonusTokens[tokenIndex].tokenid;
	}
	return 0;
}

Jaipur.prototype.checkEnoughGoods = function() {
	var goodsTokens = [	'diamond','gold','silver','silk','spice','leather'];
	var emptyTokens = 0;
	for(var i in goodsTokens) {
		var marketTokens = this.getMarketTokensByType(goodsTokens[i]);
		if(marketTokens.length == 0)
			emptyTokens++;
	}
	if(emptyTokens > 2)
		this.endRound();
}
Jaipur.prototype.endRound = function() {
		this.dispatchToPlayers('roundEnd',{info:'roundEnded'});
}
Jaipur.prototype.getInfo = function(player1) {
	var returnObj = {};
		returnObj.playerid = (player1) ? 'player1' : 'player2';
		returnObj.enemyid = (player1) ? 'player2' : 'player1';
		returnObj.playerTurn = (player1);
		returnObj.allCards = this.allCards;
		returnObj.allTokens = this.allTokens;
		return returnObj;
}

module.exports = Jaipur;