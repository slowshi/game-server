define(['app',
		'socket-io',
		'event-emitter',
		'./game-view/index.js',
		'./chat-window/index.js',
		'./game-room-service/index.js',
		'./game-user-service/index.js'
	],function(app,io,redux){
		console.log(redux);
	app.registerController('GameServerController',
		['$rootScope','$window','cssInjector','GameUser','EventEmitter','ChatWindowService','GameRoomService',
		function($rootScope,$window,cssInjector,GameUser,EventEmitter,ChatWindowService,GameRoomService){
			cssInjector.add('/game-server/css/index.css');
			cssInjector.add('/game-server/css/bootstrap.min.css');
			cssInjector.add('/game-server/css/champs.css');

			this.EventEmitter = EventEmitter;
			this.ChatWindowService = ChatWindowService;
			this.GameRoomService = GameRoomService;
			this.GameUser = GameUser;
			this.userConnected = function(data){
				this.ChatWindowService.registerUser();
				this.GameRoomService.registerUser();
			};
			this.EventEmitter.subscribe('GameUser:Connected', this.userConnected.bind(this));
			var rootScopeApply = function(){
				var phase = $rootScope.$root.$$phase;
	            if( phase != '$apply' && phase != '$digest') {
	              $rootScope.$digest();
	            }
			};

			this.EventEmitter.subscribe('apply', rootScopeApply);

			var userSocket = io.connect('',{reconnect:true});
			this.GameUser.init(userSocket);

			this.createGame = function(){
				this.EventEmitter.trigger('GameView:ChangeState','lobby');
			};
	}]);
});
