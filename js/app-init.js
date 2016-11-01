define(['app','states'],function(app,states) {
	var appInit = function() {
		var stateProvider;
		var couchPotatoProvider;
		var urlRouterProvider;
		app.config(['$stateProvider', '$couchPotatoProvider',
		'$sceDelegateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $couchPotatoProvider,
		$sceDelegateProvider, $urlRouterProvider, $locationProvider) {
			stateProvider = $stateProvider;
			couchPotatoProvider = $couchPotatoProvider;
			urlRouterProvider = $urlRouterProvider;
			urlRouterProvider.when('/jaipur', '');
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false,
			});
			$sceDelegateProvider.resourceUrlWhitelist([
				// Allow same origin resource loads.
				'self',
				// Allow loading from our assets domain.
				// Notice the difference between * and **.
				'https://www.youtube.com/**',
			]);
		}]);

		app.run(['$couchPotato', '$state', '$stateParams', '$rootScope',
			function($couchPotato, $state, $stateParams, $rootScope) {
			app.lazy = $couchPotato;
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			stateProvider.state('root', {
				url: '/',
				views: {
					'main@': {
						templateUrl: '/game-server/index.html',
						resolve: {
							deps: couchPotatoProvider.
							resolveDependencies(['/game-server/index.js']),
						},
							controller: 'GameServerController as ctrl',
					},
				},
			});

			for(var key in states) {
				var state = states[key];
				stateProvider.state(key, {
					url: key,
					templateUrl: '/' + state.path + '/index.html',
					resolve:{
						deps: couchPotatoProvider
						.resolveDependencies(['/'+ state.path + '/index.js']),
					},
					controller: state.controller,
					parent: 'root',
				});
			}
		}]);
		var bootstrapApplication = (function() {
			angular.element(document)
				.ready(function() {
					angular.bootstrap(document, [app.name, function() {
						angular.element(document)
							.find('html')
							.addClass('ng-app');
					}]);
				});
		});
		bootstrapApplication();
	};
	return appInit;
});
