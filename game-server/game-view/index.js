define(['app'], function(app) {
	app.registerDirective('gameView',function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {
			},
			templateUrl: '/game-server/game-view/index.html',
			replace: true,
			controller: 'GameViewController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs) {
			},
		};
	});
	app.registerController('GameViewController',
	['$scope', 'cssInjector', '$element', '$state', '$window', 'EventEmitter',
	function($scope, cssInjector, $element, $state, $window, EventEmitter) {
		cssInjector.add('/game-server/game-view/index.css');
		var _this = this;
		_this.EventEmitter = EventEmitter;
		var maxWidth = 1152;
		var maxHeight = 864;
		var resizeWindow = function() {
			var wrapper = $element[0];
			var width = $window.innerWidth;
			var height = $window.innerHeight-40;

			var scale;
			if(width >= maxWidth && height >= maxHeight) {
				wrapper.style.webkitTransform = '';
				wrapper.style.left = (width - maxWidth) / 2 + 'px';
				wrapper.style.top = (height - maxHeight) / 2 + 'px';
				return;
			}
			scale = Math.min(width/maxWidth, height/maxHeight);
			wrapper.style.transform = 'scale('+scale+')';
			wrapper.style.left = (width - maxWidth * scale) / 2 + 'px';
			wrapper.style.top = (height - maxHeight * scale) / 2 + 'px';
		};
		$window.onresize = resizeWindow;
		resizeWindow();
	}]);
});
