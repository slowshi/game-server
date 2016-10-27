define(['app'], function(app) {
	app.registerDirective('chatUsers', function() {
	return{
		restrict: 'E',
		transclude: true,
		scope: {},
		templateUrl: '/game-server/chat-window/chat-users/index.html',
		replace: true,
		controller: 'ChatUsersController',
		controllerAs: 'ctrl',
		bindToController: true,
		link: function(scope, elem, attrs) {},
	};
	});
	app.registerController('ChatUsersController',
	['$scope', '$window', '$element', 'EventEmitter',
	'cssInjector', 'ChatWindowService', 'GameUser', 'storeService',
	function($scope, $window, $element, EventEmitter,
	cssInjector, ChatWindowService, GameUser, storeService) {
		cssInjector.add('/game-server/chat-window/chat-users/index.css');
		var _this = this;
		_this.ChatWindowService = ChatWindowService;
		_this.storeState = storeService.store.getState();
		var resizeChat = function() {
			var newHeight = $window.innerHeight - 88;
			var discussion = $element.children()[0];
			discussion.style.height = newHeight + 'px';
		};
		EventEmitter.subscribe('windowResize', resizeChat);
	}]);
});
