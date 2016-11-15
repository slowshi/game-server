define([], function() {
    var initialState = {};
    var ChatUserService = function(state, action) {
        if(typeof state === 'undefined') {
            state = initialState;
        }
        switch (action.type) {
            case 'updateUserList':
                state = action.userList;
            break;
        }
        return state;
    };
    return ChatUserService;
});
