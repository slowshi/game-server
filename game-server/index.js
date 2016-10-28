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
		['$rootScope', '$window', 'cssInjector', 'GameUser', 'storeService',
		'EventEmitter', 'ChatWindowService', 'GameRoomService',
		function($rootScope, $window, cssInjector, GameUser, storeService,
		EventEmitter, ChatWindowService, GameRoomService) {
			cssInjector.add('/css/index.css');
			cssInjector.add('/css/bootstrap.min.css');
			cssInjector.add('/css/champs.css');
			var _this = this;
			var rootScopeApply = function() {
				console.log(storeService.store.getState());
				var phase = $rootScope.$root.$$phase;
				if( phase != '$apply' && phase != '$digest') {
					$rootScope.$digest();
				}
			};
			storeService.store.subscribe(rootScopeApply);
			var userConnected = function userConnected() {
				GameUser.onConnect();
				ChatWindowService.onConnect();
				//this.GameRoomService.registerUser();
			};
			var userDisconnected = function userDisconnected() {
				GameUser.onDisconnect();
				ChatWindowService.onDisconnect();
			};
			var userSocket = io.connect('', {reconnect: true});
			storeService.store.dispatch({
				type: 'setSocket',
				socket: userSocket,
			});
			userSocket.on('connect', userConnected);
			userSocket.on('disconnect', userDisconnected);

			_this.createGame = function() {
				EventEmitter.trigger('GameView:ChangeState', 'lobby');
			};
	}]);
});
