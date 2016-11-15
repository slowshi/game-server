define(['preloadjs', 'soundjs'], function(preloadjs, soundjs) {
	var TrumpFaceService = function(GameUser, $timeout, storeService, $interval) {
		createjs.Sound.alternateExtensions = ['mp3'];
		createjs.Sound
		.registerSound('/game-server/games/clicker/images/wrong.mp3', 'wrong');
		createjs.Sound
		.registerSound('/game-server/games/clicker/images/sitdown.mp3', 'sitdown');
		createjs.Sound
		.registerSound('/game-server/games/clicker/images/slap.mp3', 'slap');
		var faceData = {
			element: null,
			faceSide: false,
			responseCount: 0,
			reponseInterval: null,
		};
		var talkShit = function talkShit() {
			if(Math.random()* 100 >= 50) {
				createjs.Sound.play('wrong');
			} else {
				createjs.Sound.play('sitdown');
			}
		};
		var cancelAudio = function cancelAudio() {
			if(faceData.responseInterval) {
				$timeout.cancel(faceData.responseInterval);
				faceData.responseInterval = null;
			}
		};
		var resetFace = function resetFace() {
			faceData.element.removeClass('trump-face-owe');
			cancelAudio();
			faceData.responseInterval = $timeout(talkShit, 300);
		};
		var hitFace = function hitFace(element) {
			if(!faceData.element) {
				faceData.element = element;
			}
			createjs.Sound.play('slap');
			element.addClass('trump-face-owe');
			$timeout(resetFace, 200);
			faceData.responseCount = 0;
			cancelAudio();
		};
		return {
			faceData: faceData,
			hitFace: hitFace,
		};
	};
	return TrumpFaceService;
});
