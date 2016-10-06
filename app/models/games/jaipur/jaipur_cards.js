var jaipurCards = function(){
	var cardList = [];
	var cardObj = {
		'diamond':6,
		'gold':6,
		'silver':6,
		'silk':8,
		'spice':8,
		'leather':10,
		'camel':11
	};
	var cardid = 0;
	for(var index in cardObj){
		var count = cardObj[index];
		var i = 0;
		while(i < count){
			var obj = {
				id: cardid,
				type:index,
				user:'deck',
				value:null
			}
			cardList.push(obj);
			i++;
			cardid++;
		}
	}

	return cardList;
};

module.exports = jaipurCards;
