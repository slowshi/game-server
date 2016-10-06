var Jaipur = function(socket,info){
	this.socket = socket;
	this.socket.objref = this;
	this.playerid = info.playerid;
	this.enemyid = info.enemyid;
	this.playerTurn = info.playerTurn;
	this.allCards = info.allCards;
	this.allTokens = info.allTokens;
	this.takeCamels = false;
	this.events();
	this.setupBoard();
	this.roundEnd = false;
}

Jaipur.prototype.setupBoard = function(){
	this.table = document.getElementById('game_holder');
	this.table.innerHTML = '';
	this.table.style.backgroundColor = '#691F01'
	this.marketHolder = document.createElement('div');
	this.marketHolder.className = 'marketHolder'
	
	this.tokenHolder = document.createElement('div');
	this.tokenHolder.className = 'tokenHolder'

	this.deckPile = document.createElement('div');
	this.deckPile.className = 'deckPile'

	this.discardPile = document.createElement('div');
	this.discardPile.className = 'discardPile'

	this.playerHand = document.createElement('div');	
	this.playerHand.className = 'playerHand'
	this.playerCamels = document.createElement('div');
	this.playerCamels.className = 'playerCamels';

	this.enemyHand = document.createElement('div');	
	this.enemyHand.className = 'enemyHand'
	this.enemyCamels = document.createElement('div');
	this.enemyCamels.className = 'enemyCamels';

	this.takeBtn = document.createElement('div');
	this.takeBtn.className = 'takeBtn';
	this.takeBtn.innerHTML = 'Take';
	this.takeBtn.objref = this;
	this.takeBtn.onclick = function(){
		if(this.objref.roundEnd){
			$('#messages').prepend(divSystemContentElement("Round is over"));
			return;
		}
		if(this.objref.playerTurn)
			this.objref.takeAction()
		else
			$('#messages').prepend(divSystemContentElement("It's not your turn."));

	}
	this.tradeBtn = document.createElement('div');
	this.tradeBtn.className = 'tradeBtn';
	this.tradeBtn.innerHTML = 'Trade';
	this.tradeBtn.objref = this;
	this.tradeBtn.onclick = function(){
		if(this.objref.roundEnd){
			$('#messages').prepend(divSystemContentElement("Round is over"));
			return;
		}
		if(this.objref.playerTurn)
			this.objref.tradeAction()
		else
			$('#messages').prepend(divSystemContentElement("It's not your turn."));

	}
	this.sellBtn = document.createElement('div');
	this.sellBtn.className = 'sellBtn';
	this.sellBtn.innerHTML = 'Sell';
	this.sellBtn.objref = this;
	this.sellBtn.onclick = function(){
		if(this.objref.roundEnd){
			$('#messages').prepend(divSystemContentElement("Round is over"));
			return;
		}
		if(this.objref.playerTurn)
			this.objref.sellAction()
		else
			$('#messages').prepend(divSystemContentElement("It's not your turn."));
	}
	this.playerTokenHolder = document.createElement('div');
	this.playerTokenHolder.className = 'playerTokenHolder';

	this.enemyTokenHolder = document.createElement('div');
	this.enemyTokenHolder.className = 'enemyTokenHolder';	

	this.playerText = document.createElement('div');
	this.playerText.className = 'playerText';
	this.playerText.innerHTML = this.playerid + ' : ' + this.countPlayerTokens(this.playerid);

	this.enemyText = document.createElement('div');
	this.enemyText.className = 'enemyText';
	this.enemyText.innerHTML = this.enemyid + ' : ' + this.countPlayerTokens(this.enemyid);

	this.table.appendChild(this.marketHolder);
	this.table.appendChild(this.tokenHolder);
	this.table.appendChild(this.deckPile);
	this.table.appendChild(this.discardPile);
	this.table.appendChild(this.tradeBtn);
	this.table.appendChild(this.sellBtn);
	this.table.appendChild(this.takeBtn);
	this.table.appendChild(this.playerHand);
	this.table.appendChild(this.enemyHand);	
	this.table.appendChild(this.playerCamels);
	this.table.appendChild(this.enemyCamels);	
	this.table.appendChild(this.playerTokenHolder);
	this.table.appendChild(this.enemyTokenHolder);	
	this.table.appendChild(this.playerText);
	this.table.appendChild(this.enemyText);
	this.gameInit();
}

Jaipur.prototype.gameInit = function(){
	for(var i in this.allCards){
		var allCard = this.allCards[i];
		this.makeCard(allCard);
	}	

	for(var i in this.allTokens){
		var allToken = this.allTokens[i];
		this.makeToken(allToken);
	}
	this.sortTokens();
	this.sortCards();
	this.showTurn(this.playerTurn);
}

Jaipur.prototype.sortCards = function(){
	var marketCards = this.getCardsByHolder('market');
	var playerCards = this.getCardsByHolder(this.playerid);
	var enemyCards = this.getCardsByHolder(this.enemyid);
	var soldCards = this.getCardsByHolder('sold');
	var deckCards = this.getCardsByHolder('deck');

	var playerCamels = 0;
	var enemyCamels = 0;
	this.deselectCards();

	for(var i in marketCards){
		var cardObj = marketCards[i];
			cardObj.card.style.left = i * 90 + 'px';
			if(cardObj.type == 'camel'){
				this.moveCamels(cardObj,'market');
			}
			this.marketHolder.appendChild(cardObj.card)
	}
	for(var i in playerCards){
		var cardObj = playerCards[i];
			if(cardObj.type == 'camel'){
				cardObj.card.style.left = playerCamels*60 + 'px';
				this.moveCamels(cardObj,this.playerid);
				playerCamels++
			}else{
				cardObj.card.style.left = i*90 + 'px';
				this.playerHand.appendChild(cardObj.card);
			}
	}	
	for(var i in enemyCards){
		var cardObj = enemyCards[i];
			if(cardObj.type == 'camel'){
				cardObj.card.style.left = '0px';
				this.moveCamels(cardObj,this.enemyid);
				enemyCamels++;
			}else{
				cardObj.card.style.left = i*90 + 'px';
				this.enemyHand.appendChild(cardObj.card);
			}
	}
	for(var i in deckCards){
		var cardObj = deckCards[i];
			cardObj.card.front.style.visibility = 'hidden';
			cardObj.card.style.left = 1 * i + 'px';
		this.deckPile.appendChild(cardObj.card);
	}
	//this.deckPile.innerHTML = deckCards.length;

	soldCards.sort(function(a,b) { return parseFloat(a.sellid) - parseFloat(b.sellid) } );
	for(var i in soldCards){
		var cardObj = soldCards[i];
			cardObj.card.style.left = '0px';
			this.discardPile.appendChild(cardObj.card);
	}

}

Jaipur.prototype.makeCard = function (cardObj){
	var card = document.createElement('div');
		card.className = 'card';

		var img = new Image();
			img.style.position = 'absolute';
			img.src = './images/cards/back_card.png';
			img.style.height = '100px';
			img.style.width = '80px';
			card.appendChild(img);	
		card.back = img;
		var img = new Image();
			img.style.position = 'absolute';
			img.src = './images/cards/'+cardObj.type+'_card.png';
			img.style.height = '100px';
			img.style.width = '80px';
		if(cardObj.type != 'camel' && cardObj.holder == this.enemyid)
			img.style.visibility = 'hidden';
			card.appendChild(img);
		card.front = img;
		card.objref = this;
		card.cardObj = cardObj;

		card.onclick = function(){
			if(this.cardObj.holder == this.objref.enemyid){
				return;
			}
			if(this.cardObj.type == 'camel' && this.cardObj.holder == 'market'){
				var selectedCards = this.objref.getSelectedCards();
				for(var i = selectedCards.length-1; i > -1; i--){
					var selectObj = selectedCards[i];
					if(selectObj.type != 'camel' || selectObj.holder != 'market')
						this.objref.selectCard(selectObj,false);
				}
				this.objref.selectCamels(!this.cardObj.selected);
			}else{
				this.objref.selectCamels(false);
				this.objref.selectCard(this.cardObj,!this.cardObj.selected);
			}
		}
		cardObj.card = card;
}

Jaipur.prototype.moveCamels = function(cardObj,dest){
	switch(dest){
		case this.playerid:
			cardObj.holder = this.playerid;
			transform(cardObj.card,'rotate', 270);
			transform(cardObj.card,'origin','40px 40px');
			this.playerCamels.appendChild(cardObj.card);
		break;
		case 'market':
			cardObj.holder = 'market';
			transform(cardObj.card,'rotate', 0);
			transform(cardObj.card,'origin','0px 0px');
			this.marketHolder.appendChild(cardObj.card);
		break;
		case this.enemyid:
			cardObj.holder = this.enemyid;
			transform(cardObj.card,'rotate', 270);
			transform(cardObj.card,'origin','40px 40px');
			this.enemyCamels.appendChild(cardObj.card);
		break;	
	}
}

Jaipur.prototype.selectCard = function(cardObj,bool){
	cardObj.selected = bool;
	cardObj.card.style.border = (bool) ? '3px solid #ADD8E6' : '';
}

Jaipur.prototype.selectCamels = function(bool){
	this.takeCamels = bool;
	var marketCards = this.getCardsByHolder('market');
	for(var i in marketCards){
		var card = marketCards[i];
			if(card.type == 'camel'){
				this.selectCard(card,bool);
			}
	}
}

Jaipur.prototype.getCardsByHolder = function(holder,selected){
		var holderCards = [];
	for(var i in this.allCards){
		var cardObj = this.allCards[i];
		if(cardObj.holder == holder){
			if(selected !== void 0){
				if(cardObj.selected == selected)
					holderCards.push(cardObj);
			}else{
				holderCards.push(cardObj);
			}
		}
	}
	return holderCards;
}

Jaipur.prototype.getSelectedCards = function(){
	var selectedCards = [];
	for(var i in this.allCards){
		var cardObj = this.allCards[i];
		if(cardObj.selected == true){
			selectedCards.push(cardObj);
		}
	}
	return selectedCards;
}
Jaipur.prototype.giveCards = function(cardid,to){
	for(var i in this.allCards){
		var cardObj = this.allCards[i];
		if(cardObj.cardid == cardid){
			if(to == 'sold'){
				var soldCards = this.getCardsByHolder('sold');
					cardObj.sellid = soldCards.length;
			}
			cardObj.holder = to;
			if(to == this.enemyid){
				cardObj.card.front.style.visibility = (cardObj.type != 'camel') ? 'hidden' : 'inherit';
			}else{
				cardObj.card.front.style.visibility = 'inherit';
			}
		}
	}
}

Jaipur.prototype.getPlayerGoods = function(){
	var playerGoods = [];
	for(var i in this.allCards){
		var cardObj = this.allCards[i];
		if(cardObj.holder == this.playerid && cardObj.type != 'camel')
			playerGoods.push(cardObj);
	}
	return playerGoods.length;
}

Jaipur.prototype.deselectCards = function(){
	for(var i in this.allCards){
		var cardObj = this.allCards[i];
			this.selectCard(cardObj,false);
	}
}
Jaipur.prototype.showTurn = function(bool){
	if(bool){
		this.takeBtn.style.border = '2px solid black';
		this.tradeBtn.style.border = '2px solid black';
		this.sellBtn.style.border = '2px solid black';
	}else{
		this.takeBtn.style.border = '';
		this.tradeBtn.style.border = '';
		this.sellBtn.style.border = '';
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Jaipur.prototype.makeToken = function(tokenObj){
	var token = document.createElement('div');
		token.className = 'token';

		var img = new Image();
			img.style.position = 'absolute';
			img.src = './images/tokens/'+tokenObj.type+'_token.png';
			img.style.width = '75px';
			img.style.height = '75px';
		token.appendChild(img);
		tokenObj.token = token;
}
Jaipur.prototype.sortTokens = function(){
	var marketTokens = this.getTokensByHolder('market');
	var playerTokens = this.getTokensByHolder(this.playerid);
	var enemyTokens = this.getTokensByHolder(this.enemyid);
	var counter = {
			diamondCount: 0,
			goldCount: 0,
			silverCount: 0,
			silkCount: 0,
			spiceCount: 0,
			leatherCount: 0,
			threeCount: 0,
			fourCount: 0,
			fiveCount: 0
		};
	playerTokens.sort(function(a,b) { return parseFloat(a.sellid) - parseFloat(b.sellid) } );
	enemyTokens.sort(function(a,b) { return parseFloat(a.sellid) - parseFloat(b.sellid) } );
	for(var i in playerTokens){
		var tokenObj = playerTokens[i];
			tokenObj.token.style.left = '0px';
			tokenObj.token.style.top = i * 3 + 'px';
			this.playerTokenHolder.appendChild(tokenObj.token);
	}

	for(var i in enemyTokens){
		var tokenObj = enemyTokens[i];
			tokenObj.token.style.left = '0px';
			tokenObj.token.style.top = i * 3 + 'px';
			this.enemyTokenHolder.appendChild(tokenObj.token);
	}

	for(var i in marketTokens){
		var tokenObj = marketTokens[i];
		if(tokenObj.type == 'combo_3' || tokenObj.type == 'combo_4' || tokenObj.type == 'combo_5')
			continue;
		var tokenLeft = 0;
		var tokenTop = 0;
			switch(tokenObj.type){
				case 'diamond':
					tokenTop = 0;
					tokenLeft = counter.diamondCount * 7;
					counter.diamondCount++;
				break;
				case 'gold':
					tokenTop = 80;
					tokenLeft = counter.goldCount * 7;
					counter.goldCount++;
				break;
				case 'silver':
					tokenTop = 160;
					tokenLeft = counter.silverCount * 7;
					counter.silverCount++;
				break;
				case 'silk':
					tokenTop = 240;
					tokenLeft = counter.silkCount * 7;
					counter.silkCount++;
				break;
				case 'spice':
					tokenTop = 320;
					tokenLeft = counter.spiceCount * 7;
					counter.spiceCount++;
				break;
				case 'leather':
					tokenTop = 400;
					tokenLeft = counter.leatherCount * 7;
					counter.leatherCount++;
				break;
			}
			tokenObj.token.style.left = tokenLeft + 'px';
			tokenObj.token.style.top = tokenTop + 'px';
			this.tokenHolder.appendChild(tokenObj.token);
	}
	this.playerText.innerHTML = this.playerid + ' : ' + this.countPlayerTokens(this.playerid);
	this.enemyText.innerHTML = this.enemyid + ' : ' + this.countPlayerTokens(this.enemyid);
}
Jaipur.prototype.getTokensByHolder = function(holder){
	var holderTokens = [];
	for(var i in this.allTokens){
		var tokenObj = this.allTokens[i];
		if(tokenObj.holder == holder){
			holderTokens.push(tokenObj);
		}
	}
	return holderTokens;
}
Jaipur.prototype.countPlayerTokens = function(player){
	var playerTokens = this.getTokensByHolder(player);
	var count = 0;
	for(var i in playerTokens){
		var tokenObj = playerTokens[i];
		count += tokenObj.value;
	}
	return count
}
Jaipur.prototype.giveTokens = function(tokenid,to){
	for(var i in this.allTokens){
		var tokenObj = this.allTokens[i];
		if(tokenObj.tokenid == tokenid){
			var holderTokens = this.getTokensByHolder(to);
				tokenObj.sellid = holderTokens.length;
			tokenObj.holder = to;
		}
	}
}

//////////Player Events//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Jaipur.prototype.events = function(){
	this.socket.on('leaveGame',function(){
		console.log('Left Game.')
	});	
	this.socket.on('updateMarket',function(info){
		$('#messages').prepend(divSystemContentElement(info.msg));
		this.objref.playerTurn = (info.playerid != this.objref.playerid)

		this.objref.showTurn(info.playerid != this.objref.playerid);

		if(info.playerid == this.objref.enemyid){
			for(var i in info.enemyCards){
				this.objref.giveCards(info.enemyCards[i],this.objref.enemyid);
			}
		}
		for(var i in info.marketCards){
			this.objref.giveCards(info.marketCards[i],'market');
		}
		
		this.objref.sortCards();
	});	

	this.socket.on('updateSell',function(info){
		$('#messages').prepend(divSystemContentElement(info.msg));
		this.objref.playerTurn = (info.playerid != this.objref.playerid)
		
		this.objref.showTurn(info.playerid != this.objref.playerid);

		for(var i in info.soldCards){
			this.objref.giveCards(info.soldCards[i],'sold');
		}
		for(var i in info.tokens){
			this.objref.giveTokens(info.tokens[i],info.playerid);
		}
		this.objref.sortCards();
		this.objref.sortTokens();
	});
		this.socket.on('roundEnd',function(info){ 
			this.objref.roundEnd = true;
			var playerCount = this.objref.countPlayerTokens(this.objref.playerid);
			var enemyCount = this.objref.countPlayerTokens(this.objref.enemyid);
			var msg = (playerCount > enemyCount) ? this.objref.playerid : this.objref.enemyid;
				msg += ' won the round.';
			$('#messages').prepend(divSystemContentElement(msg));

		});	

}

Jaipur.prototype.takeAction = function(){
	var marketGoods = 0;
	var invalidCard = false;
	var err  = '';
	var msg = '';
	var selectedCards = this.getSelectedCards();
	for(var i in selectedCards){
		var cardObj = selectedCards[i];
		if(cardObj.holder == this.playerid){
			invalidCard = true;
		}else{
			if(cardObj.type != 'camel'){
				marketGoods++;
			}
		}
	}
	if(invalidCard){
		err = 'You may only take from the Market.(One card or Camels).';
	}else if(marketGoods > 1){
		err = 'You may only take one good the Market. (Or Camels).';
	}else if(selectedCards.length ==0){
		err = 'Choose what you want to take.';
	}else if(this.getPlayerGoods() + 1 > 7 && !this.takeCamels){
		err = 'You may not have more than 7 goods.';
	}

	if(err != ''){
		$('#messages').prepend(divSystemContentElement(err));
		return;
	}
	var camCount = 0;
	var camids = [];
	var marketCards = this.getCardsByHolder('market');

	for(var i = marketCards.length-1; i > -1; i--){
		var cardObj = marketCards[i];
		if(cardObj.selected){
			if(cardObj.type == 'camel'){
				camCount++
				cardObj.holder = this.playerid;
				camids.push(cardObj.cardid);
			}else{
				cardObj.holder = this.playerid;
			}
		}
	}
	if(this.takeCamels == true){
		msg = this.playerid +' took '+camids.length+ ' camels from the market.';
		this.socket.emit('takeGood',{cardids:camids,playerid:this.playerid,msg:msg});
	}else if(selectedCards.length == 1){
		msg = this.playerid +' took <b>' + selectedCards[0].type + '</b> from the market.';
		this.socket.emit('takeGood',{cardids:[selectedCards[0].cardid],playerid:this.playerid,msg:msg})
	}
	this.sortCards();
}

Jaipur.prototype.tradeAction = function(){
	var playerCards = 0;
	var marketCards = 0;
	var marketGoods = 0;
	var err = '';
	var msg = '';
	var playerTypes = [];
	var marketTypes = [];
	var selectedCards = this.getSelectedCards();

	for(var i in selectedCards){
		var cardObj = selectedCards[i];
		if(cardObj.holder == this.playerid){
			playerCards++;
			playerTypes.push(cardObj.type);
		}else if(cardObj.holder == 'market'){
			marketCards++;
			if(cardObj.type != 'camel')
				marketGoods++;
			marketTypes.push(cardObj.type);
		}
	}
	var sameGoods = false;
	for(var i in marketTypes){
		for(var j in playerTypes){
			if(marketTypes[i] == playerTypes[j]){
				sameGoods = true;
			}
		}
	}
	if(selectedCards.length == 0){
		err = 'Choose what you want to trade.';
	}else if(playerCards == 1 && marketCards == 1){
		err = 'You must trade more than one good at the Market.';
	}else if(playerCards != marketCards){
		err = 'You must have an equal trade with the Market.';
	}else if (sameGoods){
		err = 'You may not trade like goods with the Market.';
	}else if(this.getPlayerGoods().length + marketCards > 7){
		err = 'You may not have more than 7 goods.';
	}
	if(err != ''){
		$('#messages').prepend(divSystemContentElement(err));
		return;
	}
	var giveMarket = [];
	var givePlayer = [];
	var playerSelected = this.getCardsByHolder(this.playerid,true);
	var marketSelected = this.getCardsByHolder('market',true);

	for(var i in playerSelected){
		var cardObj = playerSelected[i];
			cardObj.holder = 'market';
			giveMarket.push(cardObj.cardid);
	}
	for(var i in marketSelected){
		var cardObj = marketSelected[i];
			cardObj.holder = this.playerid;
			givePlayer.push(cardObj.cardid);
	}
	msg = this.playerid + ' traded <b>'+playerTypes.toString().replace(',',', ')+ '</b> for <b>'+marketTypes.toString().replace(',',', ') +'</b>.';
	this.socket.emit('tradeGoods',{givePlayer:givePlayer, giveMarket:giveMarket, playerid:this.playerid,msg:msg});
	this.sortCards();
}
Jaipur.prototype.sellAction = function(){
	var goodsTypes =[];
	var invalidCard = false;
	var differentGoods = false;
	var err = '';
	var msg = '';
	var selectedCards = this.getSelectedCards();

	for(var i in selectedCards){
		var cardObj = selectedCards[i];
		if(cardObj.holder == this.playerid){
			if(goodsTypes.indexOf(cardObj.type) == -1)
				goodsTypes.push(cardObj.type);
		}else if(cardObj.holder == 'market'){
			invalidCard = true;
		}
	}
	if(goodsTypes.length > 1)
		differentGoods = true;

	if(selectedCards.length == 0){
		err = 'Choose what you want to Sell.';
	}else if(invalidCard){
		err = 'You may only sell goods that you own.';
	}else if(differentGoods){
		err = 'You may only sell one type of good.';
	}else if(selectedCards.length == 1 && (goodsTypes[0] == 'diamond' || goodsTypes[0] == 'gold' || goodsTypes[0] == 'silver')){
		err = 'You must sell at least two of any expensive goods. (Diamond, Gold, Silver)';
	}
	if(err != ''){
		$('#messages').prepend(divSystemContentElement(err));
		return;
	}
	var sellGoods = [];
	var playerSelected = this.getCardsByHolder(this.playerid,true);
	var soldCards = this.getCardsByHolder('sold');
	var goodsType = '';
	for(var i in playerSelected){
		var cardObj = playerSelected[i];
			cardObj.holder = 'sold';
			goodsType = cardObj.type;
			cardObj.sellid = soldCards.length++;
			sellGoods.push(cardObj.cardid);
	}

	msg = this.playerid + ' sold <b>'+sellGoods.length+ ' '+goodsType+'</b>.';
	this.socket.emit('sellGoods',{action:'sellGoods',goods:sellGoods,playerid:this.playerid,msg:msg});
	this.sortCards();
}