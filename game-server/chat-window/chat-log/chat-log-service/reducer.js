define([], function() {
    var initialState = [];
    var ChatWindowReducer = function(state, action) {
        if(typeof state === 'undefined') {
            state = initialState;
        }
        switch (action.type) {
            case 'recieveMessage':
                state.push(action.message);
            break;
        }
        return state;
    };
    return ChatWindowReducer;
});
