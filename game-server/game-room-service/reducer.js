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
            case 'setName':
                state.name = action.name;
            break;
            case 'setSocket':
                state.socket = action.socket;
            break;
            case 'setAvatar':
                state.avatar = action.avatar;
            break;
            case 'setRooms':
                state.rooms = action.rooms;
            break;
            case 'setSocketid':
                state.socketid = state.socket.socket.sessionid;
				state.validSocketIds.push(state.socketid);
            break;
            case 'setGameid':
                state.gameid = action.gameid;
            break;
        }
        return state;
    };
    return ChatWindowReducer;
});
