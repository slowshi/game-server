define([], function() {
    var initialState = {
        gameRooms: {},
		gameList: {},
    };
    var ChatWindowReducer = function(state, action) {
        if(typeof state === 'undefined') {
            state = initialState;
        }
        switch (action.type) {
            case 'updateGameRooms':
                state.gameRooms = action.gameRooms;
            break;
            case 'updateGameList':
                state.gameList = action.gameList;
            break;
        }
       return state;
    };
    return ChatWindowReducer;
});
