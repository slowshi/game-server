define([], function() {
    var initialState = {
        chatLog: [],
        chatList: [],
        chatRooms: [],
    };
    var ChatWindowReducer = function(state, action) {
        if(typeof state === 'undefined') {
            state = initialState;
        }
        switch (action.type) {
            case 'recieveMessage':
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
