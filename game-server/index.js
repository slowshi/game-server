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
		'EventEmitter', 'ChatWindowService', 'GameRoomService', '$state',
		function($scope, $window, cssInjector, GameUser, storeService,
		EventEmitter, ChatWindowService, GameRoomService, $state) {
			cssInjector.add('/css/index.css');
			cssInjector.add('/css/bootstrap.min.css');
			cssInjector.add('/css/champs.css');
			var _this = this;
			var rootScopeApply = function() {
				console.log(storeService.store.getState());
				var phase = $scope.$$phase;
				if( phase != '$apply' && phase != '$digest') {
					$scope.$digest();
				}
			};
			storeService.store.subscribe(rootScopeApply);
			var userConnected = function userConnected() {
				GameUser.onConnect();
				ChatWindowService.onConnect();
				GameRoomService.onConnect();
			};
			var userDisconnected = function userDisconnected() {
				GameUser.onDisconnect();
				ChatWindowService.onDisconnect();
				GameRoomService.onDisconnect();
			};
			var userSocket = io.connect('', {reconnect: true});
			storeService.store.dispatch({
				type: 'setSocket',
				socket: userSocket,
			});
			userSocket.on('connect', userConnected);
			userSocket.on('disconnect', userDisconnected);

			_this.loadView = '';
			_this.onChangeState = function(state) {
				if(state !== _this.loadView) {
					_this.loadView = state;
					$state.transitionTo(_this.loadView);
				}
			};
			EventEmitter.subscribe('GameView:ChangeState', _this.onChangeState);
			$state.transitionTo('lobby');
	}]);
});
