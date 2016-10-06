define(['app'],function(app){
	app.registerDirective('gameRoom',function(){
		return{
			restrict:'E',
			transclude: true,
			scope: {

			},
			templateUrl: '/game-server/game-room/index.html',
			replace: true,
			controller: 'GameRoomController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs){

			}
		};
	});
	app.registerController('GameRoomController',['$scope','cssInjector','GameRoomService',function($scope,cssInjector,GameRoomService){
		cssInjector.add('/game-server/game-room/index.css');
		this.GameRoomService = GameRoomService;
		this.leaveGameRoom = function(){
			this.GameRoomService.leaveGameRoom();
		}
		this.startGame = function(){
			this.GameRoomService.startGame();
		}
	}])
});