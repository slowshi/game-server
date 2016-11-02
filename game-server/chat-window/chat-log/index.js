define(['app'], function(app) {
	app.registerDirective('chatLog', function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {},
			templateUrl: '/game-server/chat-window/chat-log/index.html',
			replace: true,
			controller: 'ChatLogController',
			controllerAs: 'ctrl',
			bindToController: {
				roomid: '@?',
			},
			link: function(scope, elem, attrs) {},
		};
	});
	app.registerController('ChatLogController',
	['$scope', '$window', '$element', 'EventEmitter',
	'cssInjector', 'ChatLogService',
	function($scope, $window, $element, EventEmitter,
	cssInjector, ChatLogService) {
		cssInjector.add('/game-server/chat-window/chat-log/index.css');
		var _this = this;
		_this.ChatLogService = ChatLogService;
		_this.message = '';
		_this.roomid = _this.roomid || 'lobby';

		var sendMessage = function(event) {
			_this.ChatLogService.sendMessage(_this.message);
			_this.message = '';
			return false;
		};
		$element.on('submit', sendMessage.bind(_this));
		var discussion = $element.children()[0];
		var scrollTopBottom = function(newVal, lastVal) {
			var maxScroll = discussion.scrollTop + discussion.offsetHeight;
			if(lastVal >= maxScroll - 1 && maxScroll >= lastVal) {
				discussion.scrollTop = discussion.scrollHeight;
			}
		};
		$scope.$watch(function() {
			return discussion.scrollHeight;
		}, scrollTopBottom);
	}]);
});
