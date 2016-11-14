define([], function() {
	var ClickerGameService = function(GameUser) {
		var clickData = {
			clicks: 0,
			cursorPos:{x:0,y:0},
		};
		var clickModifier = 0;
		var gameInit = function gameInit() {

		};
		var addClicks = function addClicks() {
			clickData.clicks = clickData.clicks + 1;
		};
		var getMousePos = function getMousePos(evt) {
			var doc = document.documentElement || document.body;
			console.log(evt);
			var pos = {
				x: evt.layerX,
				y: evt.layerY
			};
			return pos;
		}
		var updateCursorPos = function updateCursorPos(evt) {
			var pos = getMousePos(evt);
			clickData.cursorPos.x = pos.x;
			clickData.cursorPos.y = pos.y;
		}
		return {
			clickData: clickData,
			addClicks: addClicks,
			gameInit: gameInit,
			updateCursorPos: updateCursorPos,
		};
	};
	return ClickerGameService;
});
