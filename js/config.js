require.config({
    paths: {
        'angular'              : 'angular.min',
        'angular-ui-router'    : 'angular-ui-router.min',
        'angular-couch-potato' : 'angular-couch-potato',
        'angular-css-injector' : 'angular-css-injector.min',
        'states'               : 'states',
        'app'                  : 'app',
        'app-init'             : 'app-init',
        'socket-io'            : '/socket.io/socket.io',
        'event-emitter'        : 'event-emitter/index'
    },
    shim:{
        'angular': {
            exports: 'angular'
        },
        'app':{
            deps:['angular']
        },
        'app-init':{
            deps:['angular','app','socket-io']
        }
    }
});

require(['app-init'],function(appInit){
    appInit();
});