define(['app',
		'socket-io',
		'event-emitter',
		'./game-view/index.js',
		'./chat-window/index.js',
		'./game-room-service/index.js',
		'./game-user-service/index.js',
		'./store-service/index.js',
	], function(app, io) {
	app.registerController('GameServerController',
		['$scope', '$window', 'cssInjector', 'GameUser', 'storeService',
		'ChatUserService', 'ChatWindowService',
		'ChatLogService', 'GameRoomService', '$state',
		function($scope, $window, cssInjector, GameUser, storeService,
		ChatUserService, ChatWindowService,
		ChatLogService, GameRoomService, $state) {
			cssInjector.add('/css/index.css');
			cssInjector.add('/css/bootstrap.min.css');
			cssInjector.add('/css/champs.css');
			var _this = this;
			var rootScopeApply = function() {
				var phase = $scope.$$phase;
				if( phase != '$apply' && phase != '$digest') {
					$scope.$digest();
				}
			};
			storeService.store.subscribe(rootScopeApply);
			var userConnected = function userConnected() {
				GameUser.onConnect();
				ChatUserService.onConnect();
				ChatLogService.onConnect();
				GameRoomService.onConnect();
			};
			var userDisconnected = function userDisconnected() {
				GameUser.onDisconnect();
				ChatUserService.onDisconnect();
				ChatLogService.onConnect();
				GameRoomService.onDisconnect();
			};
			var userSocket = io.connect('', {reconnect: true});
			userSocket.on('connect', userConnected);
			userSocket.on('disconnect', userDisconnected);
			storeService.store.dispatch({
				type: 'setSocket',
				socket: userSocket,
			});
			$state.transitionTo('lobby');
	}]);
});
