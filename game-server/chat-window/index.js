define([
	'app',
	'./chat-window-service/index.js',
	'./chat-users/chat-user-service/index.js',
	'./chat-log/chat-log-service/index.js',
	'./chat-log/index.js',
	'./chat-users/index.js'],
function(app) {
	app.registerDirective('chatWindow', function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {
				room: '@',
			},
			templateUrl: '/game-server/chat-window/index.html',
			replace: true,
			controller: 'ChatWindowController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs) {
			},
		};
	});
	app.registerController('ChatWindowController',
	['$rootScope', '$window', '$element',
	'cssInjector', 'ChatWindowService', 'GameUser',
	function($rootScope, $window, $element,
	cssInjector, ChatWindowService, GameUser) {
		cssInjector.add('/game-server/chat-window/index.css');
		var _this = this;
		_this.ChatWindowService = ChatWindowService;
	}]);
});