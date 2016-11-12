define(['app'], function(app) {
    app.registerDirective('mockView',
    ['$state', '$compile', '$controller', 'cssInjector',
    function($state, $compile, $controller, cssInjector) {
    return {
      restrict: 'EA',
      link: function(scope, elem, attrs) {
        var htmlPath = '/' + attrs.id + '/index';
        cssInjector.add(htmlPath + '.css');
        require([
          'text!' + htmlPath + '.html',
          htmlPath + '.js',
          ], function(html) {
            var newScope = scope.$new();
          var controllerInstance = $controller('GameRoomController',
              {
                $element: html,
                $scope: newScope,
              },
              true,
              'GameRoomCtrl'
          );
          var linkFn = $compile(angular.element(html));
          elem.append(linkFn(scope.$new()));
          scope.$apply();
        });
      },
    };
  }]);
});
