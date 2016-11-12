define([], function() {
	var ClickerGameService = function(GameUser) {
		var clickData = {
			clicks: 0,
		};
		var clickModifier = 0;
		var gameInit = function gameInit() {

		};
		var addClicks = function addClicks() {
			clickData.clicks = clickData.clicks + 1;
		};
		return {
			clickData: clickData,
			addClicks: addClicks,
			gameInit: gameInit,
		};
	};
	return ClickerGameService;
});
