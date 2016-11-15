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
	['$scope', 'cssInjector', 'handCursorService', '$element',
	function($scope, cssInjector, handCursorService, $element) {
		cssInjector.add('/game-server/games/clicker/hand-cursor/index.css');
		var _this = this;
		_this.handCursorService = handCursorService;
		_this.handCursorService.handData.element = $element;
	}]);
});