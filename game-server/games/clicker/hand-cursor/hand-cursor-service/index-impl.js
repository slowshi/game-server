define([], function() {
	var HandCursorService = function(GameUser, $timeout) {
		var handData = {
			element: null,
			handSide: false,
		};

		var slapAction = function slapAction() {
			handData.handSide = !handData.handSide;
			if(handData.handSide) {
				console.log("ADD BACKHAND");
				handData.element.addClass('back-hand');
			}else {
				handData.element.removeClass('back-hand');
			}
		};
		return {
			handData: handData,
			slapAction: slapAction,
		};
	};
	return HandCursorService;
});
