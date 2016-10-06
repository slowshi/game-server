var jaipurTokens = function(){
	var tokenList = [];
	var tokenObj = {
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
	var tokenid = 0;
	for(var index in tokenObj){
		var tokensType = tokenObj[index];
		var i = 0;
		for(var toks in tokensType){
			var obj = {
				id:tokenid,
				type:index,
				value:tokensType[toks],
				user:'deck'
			}
			tokenList.push(obj);
			i++;
			tokenid;
		}
	}
	return tokenList;
};

module.exports = jaipurTokens;
