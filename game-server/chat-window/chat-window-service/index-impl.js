define([],
  function() {
  var ChatWindowService = function(storeService) {
    var chatWindows = {};

    var updateChatWindow = function updateChatWindow() {
      var gameUser = storeService.store.getState().gameUser;
      for(var i in gameUser.rooms) {
        if(chatWindows[gameUser.rooms[i]] === void 0) {
          chatWindows[gameUser.rooms[i]] = {
            showList: false,
            chatOpen: true,
          };
        }
      }
    };
    storeService.store.subscribe(updateChatWindow);

    return {
      chatWindows: chatWindows,
    };
  };
  return ChatWindowService;
});
