define(['app'], function(app) {
	app.registerDirective('chatBubble', function() {
		return{
			restrict: 'E',
			transclude: true,
			scope: {},
			templateUrl: '/game-server/chat-window/chat-bubble/index.html',
			replace: true,
			controller: 'ChatBubbleController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs) {},
		};
	});
	app.registerController('ChatBubbleController',
	['$scope', '$window', '$element', 'EventEmitter',
	'cssInjector', 'ChatWindowService', 'GameUser',
	function($scope, $window, $element, EventEmitter,
	cssInjector, ChatWindowService, GameUser) {
		cssInjector.add('/game-server/chat-window/chat-bubble/index.css');
		var _this = this;
		_this.ChatWindowService = ChatWindowService;
		_this.GameUser = GameUser;
		_this.chatLog = _this.ChatWindowService.chatLog;
		_this.message = '';
		_this.getTimeSince = function() {
			return _this.time;
		};
		_this.openUrl = function(url) {
			$window.open(url);
		};

		var sendMessage = function(event) {
			_this.ChatWindowService.sendMessage(_this.message, GameUser);
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
		var resizeChat = function() {
			var newHeight = $window.innerHeight - 88;
			discussion.style.height = newHeight + 'px';
		};
		EventEmitter.subscribe('windowResize', resizeChat);
	}]);
});
