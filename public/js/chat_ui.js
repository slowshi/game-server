function divEscapedContentElement(message, id) {
	if(id !== void 0)
		return $('<div id="'+id+'"></div>').text(message);
	else
		return $('<div></div>').text(message);
}
function divSystemContentElement(message) {
	return $('<div style="color:#5A856E"></div>').html('<i>' + message + '</i>');
}
function processUserInput(chatApp, socket) {
	var message = $('#send_message').val();
	var systemMessage;

	if (message.charAt(0) == '/') {
		systemMessage = chatApp.processCommand(message);
		if (systemMessage) {
			addChatText(divSystemContentElement(systemMessage));
		}
	} else {
		chatApp.sendMessage($('#room').text(), message);

		addChatText(divEscapedContentElement(user + ': '+message));
	}
	$('#send_message').val('');
}
function transform(div,type,amount){
	switch(type){
		case 'rotate':
			div.style.transform = 'rotate('+amount+'deg)';
			div.style.msTransform = 'rotate('+amount+'deg)';
			div.style.mozTransform = 'rotate('+amount+'deg)';
			div.style.webkitTransform = 'rotate('+amount+'deg)';
			div.style.oTransform = 'rotate('+amount+'deg)';
		break;
		case 'origin':
			div.style.transformOrigin = amount;
			div.style.msTransformOrigin = amount;
			div.style.mozTransformOrigin = amount;
			div.style.webkitTransformOrigin = amount;
			div.style.oTransformOrigin = amount;
		break;
	}
}
function toggleMessage(){
	var holder = document.getElementById('message_holder');
	var messages = document.getElementById('messages');
	if(!messageClosed){
		holder.style.height = '16px'
		holder.style.top = '574px';
		messageClosed = true;
	}else{
		holder.style.height = '200px'
		holder.style.top = '390px';
		messageClosed = false;
	}
}
function startRoomGame(){
	socket.emit('createGameAttempt');
}
function joinRoomGame(event){
	if(currentGameid == 0){
	var message = 'Select a game you want to join.';
		addChatText(divSystemContentElement(message));
		return;
	}
	socket.emit('joinGameAttempt',{gameid:currentGameid});
}
function addChatText(text){
	$('#chatroom').append(text);
	var container = document.getElementById("chatroom");
	var maxTop = container.scrollHeight - container.clientHeight;
	var aoe = container.scrollHeight - container.clientHeight - 150;
	
		if(container.scrollTop < aoe)
		{
			//leave this blank i guess  O_o
		}
		else
		container.scrollTop = maxTop;
}
var socket = io.connect();
var messageClosed = true;
var userList = [];
var user = '';

var gameList = [];
var currentGameid = 0;

$(document).bind('touchmove', false);
$(document).ready(function() {
	var chatApp = new Chat(socket);
	// var roller = new DiceRoller();

	socket.on('nameResult', function(result) {
		var message;
		if (result.success) {
			message = 'You are now known as ' + result.name + '.';
			user = result.name;
		} else {
			message = result.message;
		}
		addChatText(divSystemContentElement(message));
	});

	socket.on('message', function (message) {
		addChatText(divSystemContentElement(message.text));
	});

	socket.on('updateUserList', function(info) {
		$('#room_list').empty();
		userList = info.users;
		for(var i in userList) {
			$('#room_list').prepend(divEscapedContentElement(userList[i],i));
		}
		$('#room_list div').click(function() {
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				for(var i in userList){
					$('#'+i).removeClass('active');
				}
				$(this).addClass('active');
			}
		});
	});

	socket.on('gameJoinResult', function(result) {
		var message = result.message;
		addChatText(divSystemContentElement(message));
	});	
	socket.on('updateGameList', function(info) {
		$('#game_list').empty();
		gameList = info.gameList;
		for(var i in gameList){
			$('#game_list').prepend(divEscapedContentElement('Game '+i,i));
		}
		$('#game_list div').click(function() {
			if(gameList[this.id].length == 2)return;

			if($(this).hasClass('active')){
				$(this).removeClass('active');
				currentGameid = 0;
			}else{
				for(var i in gameList){
					$('#'+i).removeClass('active');
				}
				$(this).addClass('active');
				currentGameid = this.id;
			}
		});
	});

	socket.on('gameStartup', function(result) {	
		var newGame = new Jaipur(socket,result);
	});
	
	$('#send_message').focus();
	$('#send_form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
});