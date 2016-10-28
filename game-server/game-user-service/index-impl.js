define([
	'./avatars.js',
	'./reducer.js',
], function(avatars, reducer) {
	var GameUser = function(storeService) {
		storeService.addReducer('gameUser', reducer);
		var setName = function(name) {
			storeService.store.dispatch({
				type: 'setName',
				name: name,
			});
		};
		var setAvatar = function(avatar) {
			storeService.store.dispatch({
				type: 'setAvatar',
				avatar: avatar,
			});
		};
		var setSocketid = function() {
			storeService.store.dispatch({
				type: 'setSocketid',
			});
		};
		var setGameid = function setGameid(gameid) {
			storeService.store.dispatch({
				type: 'setGameid',
				gameid: gameid,
			});
		};
		var userSocket = null;
		var onConnect = function onConnect() {
			userSocket = storeService.store.getState().gameUser.socket;
			setSocketid();
			userSocket.on('GameUser:UpdateUserInfo', onSetUserInfo);
		};
		var onDisconnect = function onDisconnect() {
			userSocket.removeAllListeners('GameUser:UpdateUserInfo');
		};
		var onSetUserInfo = function onSetUserInfo(data) {
			setName(data.name);
			setAvatar(data.avatar);
		};
		var getRandomChampion = function getRandomChampion(){
				var index = Math.floor(Math.random() * (avatars.length-1));
				var champStr = avatars[index];
				setAvatar(champStr);
		};
		var getChampion = function getChampion(champStr){
				if(avatars.indexOf(champStr) > -1) {
					setAvatar(champStr);
					return true;
				}
				return false;
		};
		var checkValidSockets = function checkValidSockets(socketid) {
			var validSocketIds =
				storeService.store.getState().gameUser.validSocketIds;
			return validSocketIds.indexOf(socketid) > -1;
		};

		return {
			onConnect: onConnect,
			onDisconnect: onDisconnect,
			onSetUserInfo: onSetUserInfo,
			getRandomChampion: getRandomChampion,
			getChampion: getChampion,
			checkValidSockets: checkValidSockets,
			setGameid: setGameid,
		};
	};
	return GameUser;
});
