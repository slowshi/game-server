define(['app'],function(app){
	app.registerDirective('gameWindow',function(){
		return{
			restrict:'E',
			transclude: true,
			scope: {

			},
			templateUrl: '/game-server/games/index.html',
			replace: true,
			controller: 'GamesController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs){
				console.log('in here directive');
			}
		};
	});
	app.registerController('GamesController',['$scope','cssInjector',function($scope,cssInjector){
		cssInjector.add('/game-server/games/index.css');
	}])
});