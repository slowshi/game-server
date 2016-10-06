define(['app'],function(app){
	app.registerDirective('chatBubble',function(){
		return{
			restrict:'E',
			transclude: true,
			scope: {},
			templateUrl: '/game-server/chat-window/chat-bubble/index.html',
			replace: true,
			controller: 'ChatBubbleController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs){

			}
		};
	});
	app.registerController('ChatBubbleController',['$scope','$window','$element','EventEmitter','cssInjector','ChatWindowService','GameUser',function($scope,$window,$element,EventEmitter,cssInjector,ChatWindowService,GameUser){
		cssInjector.add('/game-server/chat-window/chat-bubble/index.css');
		this.ChatWindowService = ChatWindowService;
		this.GameUser = GameUser;
		this.chatLog = this.ChatWindowService.chatLog;
		this.message = '';
		this.getTimeSince = function(){
			return this.time;
		};
		this.openUrl = function(url){
			$window.open(url);
		};

		var sendMessage = function(event){
			this.ChatWindowService.sendMessage(this.message,GameUser);
			this.message = '';
			return false;
		};
		$element.on('submit',sendMessage.bind(this));
		var discussion = $element.children()[0];
		var scrollTopBottom = function(newVal, lastVal){
			var maxScroll = discussion.scrollTop + discussion.offsetHeight;
			if(lastVal >= maxScroll - 1 && maxScroll >= lastVal){
				discussion.scrollTop = discussion.scrollHeight;
			}
		};
		$scope.$watch(function(){
			return discussion.scrollHeight;
		}.bind(this),scrollTopBottom);
		var resizeChat = function(){
			var newHeight = $window.innerHeight - 88;
			discussion.style.height = newHeight + 'px';
		};
		EventEmitter.subscribe('windowResize',resizeChat);
	}]);
});