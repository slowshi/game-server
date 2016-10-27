define([], function() {
    var initialState = {
        name: '',
        image: '',
        socket: '',
        socketid: '',
        avatar: '',
        validSocketIds: [],
        gameid: null,
    };
    var ChatWindowReducer = function(state, action) {
        if(typeof state === 'undefined') {
            state = initialState;
        }
        switch (action.type) {
            case 'setName':
                state.chatLog.push(action.message);
            break;
            case 'updateUserList':
                state.chatRooms[action.room] = action.userList;
            break;
        }
        return state;
    };
    return ChatWindowReducer;
});
