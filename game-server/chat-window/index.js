define([
	'app',
	'./chat-window-service/index.js',
	'./chat-bubble/index.js',
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
		_this.GameUser = GameUser;
		_this.chatOpen = true;
	}]);
});