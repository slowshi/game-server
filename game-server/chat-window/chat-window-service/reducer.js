define([], function() {
    var initialState = {
        chatLog: [],
        userList: [],
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
                state.userList = action.userList;
            break;
        }
        return state;
    };
    return ChatWindowReducer;
});
