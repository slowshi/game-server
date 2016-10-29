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
	['$scope', '$window', '$element', 'cssInjector', 'ChatWindowService',
	function($scope, $window, $element, cssInjector, ChatWindowService) {
		cssInjector.add('/game-server/chat-window/chat-users/index.css');
		var _this = this;
		_this.ChatWindowService = ChatWindowService;
		var resizeChat = function() {
			var newHeight = $window.innerHeight - 88;
			var discussion = $element.children()[0];
			discussion.style.height = newHeight + 'px';
		};
		$window.onresize = resizeChat;
	}]);
});
