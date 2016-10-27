define([
	'redux',
	], function(Redux) {
	var StoreService = function(EventEmitter) {
		var store = Redux.createStore(function(state, action) {
			return state;
		}, {asyncReducers: []});

		var createReducer = function createReducer(asyncReducers) {
			return Redux.combineReducers(asyncReducers);
		};

		var addReducer = function injectAsyncReducer(name, asyncReducer) {
			if(typeof store.asyncReducers === 'undefined') {
				store.asyncReducers = [];
			}
			store.asyncReducers[name] = asyncReducer;
			store.replaceReducer(createReducer(store.asyncReducers));
		};

		return {
			store: store,
			addReducer: addReducer,
		};
	};
	return StoreService;
});
