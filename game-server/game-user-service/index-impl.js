define([],function(){
	var GameUser = function(EventEmitter){
		return {
			name: '',
			image: '',
			socket: '',
			socketid:'',
			avatar: '',
			validSocketIds:[],
			gameid:null,
			emitter: EventEmitter,
			champions: ['aatrox','ahri','akali','alistar','amumu','anivia','annie','ashe','azir','bard','blitzcrank','brand','braum','caitlyn','cassiopeia','cho_gath','corki','darius','diana','dr_mundo','draven','eekko','elise','evelynn','ezreal','fiddlesticks','fiora','fizz','galio','gangplank','garen','gnar','gragas','graves','hecarim','heimerdinger','illaoi','irelia','janna','jarvan','jax','jayce','jinx','kalista','karma','karthus','kassadin','katarina','kayle','kennen','kha_zix','kindred','kog_maw','leblanc','lee_sin','leona','lissandra','lucian','lulu','lux','malphite','malzahar','maokai','master_yi','miss_fortune','mordekaiser','morgana','nami','nasus','nautilus','nidalee','nocturne','loss_of_ban','nunu','olaf','orianna','pantheon','poppy','quinn','rammus','rek_sai','renekton','rengar','riven','rumble','ryze','sejuani','shaco','shen','shyvana','singed','sion','sivir','skarner','sona','soraka','swain','syndra','tahm_kench','talon','taric','teemo','thresh','tristana','trundle','tryndamere','twisted_fate','twitch','udyr','urgot','varus','vayne','veigar','vel_koz','vi','viktor','vladimir','volibear','warwick','wukong','xerath','xin_zhao','yasuo','yorick','zac','zed','ziggs','zilean','zyra'],
			init:function(socket){
				this.socket = socket;
				this.socket.on('connect',this.onConnected.bind(this));
				this.socket.on('disconnect',this.onDisconnect.bind(this));
			},
			onConnected:function(){
				this.socketid = this.socket.socket.sessionid;
				this.validSocketIds.push(this.socketid);
				this.socket.on('GameUser:UpdateUserInfo',this.onSetUserInfo.bind(this));
				this.emitter.trigger('GameUser:Connected');
			},
			onDisconnect:function(){
				this.socket.on('GameUser:UpdateUserInfo',this.onSetUserInfo.bind(this));
				this.emitter.trigger('GameUser:Disconnected');
			},
			onSetUserInfo:function(data){
				for(var i in data){
					this[i] = data[i];
				}
			},
			getRandomChampion:function(){
				var index = Math.floor(Math.random() * (this.champions.length-1));
				var champStr = this.champions[index];
				this.avatar = champStr;
				this.socket.emit('GameUser:ChangeAvatar',champStr);
			},
			getChampion:function(champStr){
				if(this.champions.indexOf(champStr) > -1){
					this.avatar = champStr;
					this.socket.emit('GameUser:ChangeAvatar',champStr);
					return true;
				}
				return false;
			},
			checkValidSockets:function(socketid){
				return this.validSocketIds.indexOf(socketid) > -1;
			}
		};
	};
	return GameUser;
});