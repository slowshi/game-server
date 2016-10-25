define(['app','./jaipur-service/index.js'],function(app) {
	app.registerDirective('jaipur',function() {
		return{
			restrict:'E',
			transclude: true,
			scope: {

			},
			templateUrl: '/game-server/games/jaipur/index.html',
			replace: true,
			controller: 'JaipurController',
			controllerAs: 'ctrl',
			bindToController: true,
			link: function(scope, elem, attrs) {

			}
		};
	});
	app.registerController('JaipurController',['$scope','cssInjector','JaipurService',function($scope,cssInjector,JaipurService) {
		cssInjector.add('/game-server/games/jaipur/index.css');
		cssInjector.add('/game-server/games/jaipur/images/cards.css');
		cssInjector.add('/game-server/games/jaipur/images/tokens.css');
		this.JaipurService = JaipurService;
		this.JaipurService.registerUser();
		this.getClass = function(card) {
			return this.JaipurService.getCardClass(card);
		}
	}])
});