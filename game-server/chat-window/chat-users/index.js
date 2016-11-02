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
		bindToController: {
			roomid: '@?',
		},
		link: function(scope, elem, attrs) {},
	};
	});
	app.registerController('ChatUsersController',
	['$scope', '$window', '$element', 'cssInjector', 'ChatUserService',
	function($scope, $window, $element, cssInjector, ChatUserService) {
		cssInjector.add('/game-server/chat-window/chat-users/index.css');
		var _this = this;
		_this.ChatUserService = ChatUserService;
		_this.roomid = _this.roomid || 'lobby';
		var resizeChat = function() {
			var newHeight = $window.innerHeight - 88;
			var discussion = $element.children()[0];
			discussion.style.height = newHeight + 'px';
		};
		$window.onresize = resizeChat;
	}]);
});
