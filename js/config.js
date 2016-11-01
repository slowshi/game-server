require.config({
    paths: {
        'angular'              : 'angular/angular.min',
        'angular-ui-router'    : 'angular/angular-ui-router.min',
        'angular-couch-potato' : 'angular/angular-couch-potato',
        'angular-css-injector' : 'angular/angular-css-injector.min',
        'redux'                : 'redux/redux.min',
        'states'               : 'states',
        'app'                  : 'app',
        'app-init'             : 'app-init',
        'socket-io'            : '/socket.io/socket.io',
        'event-emitter'        : 'event-emitter/index',
    },
    shim:{
        'angular': {
            exports: 'angular'
        },
        'app': {
            deps: ['angular']
        },
        'app-init': {
            deps: ['angular','app','socket-io']
        },
    },
});

require(['app-init'],function(appInit) {
    appInit();
});
