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
			console.log(storeService.store);

			cssInjector.add('/css/index.css');
			cssInjector.add('/css/bootstrap.min.css');
			cssInjector.add('/css/champs.css');
			var _this = this;
			_this.EventEmitter = EventEmitter;
			_this.ChatWindowService = ChatWindowService;
			_this.GameRoomService = GameRoomService;
			_this.GameUser = GameUser;
			_this.userConnected = function(data) {
				this.ChatWindowService.registerUser();
				this.GameRoomService.registerUser();
			};
			_this.EventEmitter.subscribe('GameUser:Connected',
			_this.userConnected.bind(_this));
			var rootScopeApply = function() {
				var phase = $rootScope.$root.$$phase;
				if( phase != '$apply' && phase != '$digest') {
					$rootScope.$digest();
				}
			};
			_this.EventEmitter.subscribe('apply', rootScopeApply);
			var userSocket = io.connect('', {reconnect: true});
			_this.GameUser.init(userSocket);
			_this.createGame = function() {
				this.EventEmitter.trigger('GameView:ChangeState', 'lobby');
			};
	}]);
});
