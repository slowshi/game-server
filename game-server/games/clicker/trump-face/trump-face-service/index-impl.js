define([], function() {
	var TrumpFaceService = function(GameUser, $timeout) {
		var faceData = {
			element:null,
			handSide: false,
			faceSide: false
		};

		var resetFace = function resetFace(){
			faceData.element.removeClass('trump-face-owe');
		};
		var hitFace = function hitFace(element) {
			if(!faceData.element) {
				faceData.element = element;
			}
			element.addClass('trump-face-owe');
			$timeout(resetFace,200);
			faceData.handSide = !faceData.handSide;
		};
		return {
			faceData: faceData,
			hitFace: hitFace,
		};
	};
	return TrumpFaceService;
});
