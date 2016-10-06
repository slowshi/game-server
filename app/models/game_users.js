module.exports = {
	io:null,
	guestNumber:1,
	namesUsed:[],
	userList:{},
	champions: ['aatrox','ahri','akali','alistar','amumu','anivia','annie','ashe','azir','bard','blitzcrank','brand','braum','caitlyn','cassiopeia','cho_gath','corki','darius','diana','dr_mundo','draven','eekko','elise','evelynn','ezreal','fiddlesticks','fiora','fizz','galio','gangplank','garen','gnar','gragas','graves','hecarim','heimerdinger','illaoi','irelia','janna','jarvan','jax','jayce','jinx','kalista','karma','karthus','kassadin','katarina','kayle','kennen','kha_zix','kindred','kog_maw','leblanc','lee_sin','leona','lissandra','lucian','lulu','lux','malphite','malzahar','maokai','master_yi','miss_fortune','mordekaiser','morgana','nami','nasus','nautilus','nidalee','nocturne','loss_of_ban','nunu','olaf','orianna','pantheon','poppy','quinn','rammus','rek_sai','renekton','rengar','riven','rumble','ryze','sejuani','shaco','shen','shyvana','singed','sion','sivir','skarner','sona','soraka','swain','syndra','tahm_kench','talon','taric','teemo','thresh','tristana','trundle','tryndamere','twisted_fate','twitch','udyr','urgot','varus','vayne','veigar','vel_koz','vi','viktor','vladimir','volibear','warwick','wukong','xerath','xin_zhao','yasuo','yorick','zac','zed','ziggs','zilean','zyra'],
	registerIo:function(io, socket){
		this.io = io;
		this.setupUser(socket);
		socket.on('GameUser:SetUserInfo',this.onSetUserInfo.bind(this));
	},
	setupUser:function(socket){
		this.userList[socket.id]
		var name = this.assignGuestName(socket);
		this.userList[socket.id] = {
			name: name,
			socketid: socket.id,
			avatar: this.getRandomChampion(),
			gameid:null,
			socket:socket
		};
		var userInfo = this.getUserInfo(socket.id);
		socket.emit('GameUser:UpdateUserInfo',userInfo);
	},
	onSetUserInfo:function(data){
		console.log('updateUser',data);
	},
	getRandomChampion:function(){
		var index = Math.floor(Math.random() * (this.champions.length-1));
		return this.champions[index];
	},
	assignGuestName:function(socket){
		var name = 'Guest' + this.guestNumber;
		this.namesUsed.push(name);
		this.guestNumber += 1;
		socket.emit('GameUser:SetUserName',{success:true, name:name});
		return name;
	},
	getServerUserInfo:function(socketid){
		return this.userList[socketid];
	},
	getUserInfo:function(socketid){
		var userInfo = this.userList[socketid];
		return {
			name: userInfo.name,
			socketid: userInfo.socketid,
			avatar: userInfo.avatar,
			gameid: userInfo.currentGame
		};
	}
}