define([], function() {
	var HandCursorService = function(GameUser, $timeout) {
		var handData = {
			element:null,
			handSide: false,
		};

		var resetFace = function resetFace(){
			handData.element.removeClass('back-hand');
		};
		var hitFace = function hitFace(element) {
			if(!handData.element) {
				handData.element = element;
			}
			console.log(element);
			element.addClass('back-hand');
			handData.handSide = !handData.handSide;
		};
		return {
			handData: handData,
			hitFace: hitFace,
		};
	};
	return HandCursorService;
});
