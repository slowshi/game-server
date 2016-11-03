define(['app'], function(app) {
	app.registerDirective('gameLobby', function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {

			},
			templateUrl: '/game-server/game-lobby/index.html',
			replace: true,
			controller: 'GameLobbyController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs) {

			},
		};
	});
	app.registerController('GameLobbyController',
	['$scope', 'cssInjector', 'GameRoomService',
	function($scope, cssInjector, GameRoomService) {
		cssInjector.add('/game-server/game-lobby/index.css');
		var _this = this;
		_this.GameRoomService = GameRoomService;
	}]);
});