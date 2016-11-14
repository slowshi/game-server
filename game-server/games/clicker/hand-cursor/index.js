define(['app',
		'./hand-cursor-service/index.js'], function(app) {
	app.registerDirective('handCursor', function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {

			},
			templateUrl: '/game-server/games/clicker/hand-cursor/index.html',
			replace: true,
			controller: 'HandCursorController',
			controllerAs: 'ctrl',
			bindToController: {
				cursorPos: '=?',
			},
			link: function(scope, elem, attrs) {

			},
		};
	});
	app.registerController('HandCursorController',
	['$scope', 'cssInjector', 'clickerGameService', '$element',
	function($scope, cssInjector, clickerGameService, $element) {
		cssInjector.add('/game-server/games/clicker/hand-cursor/index.css');
		var _this = this;
	}]);
});