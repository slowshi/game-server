function DiceRoller(){
	this.totals = {
		rolls:0,
		dps:0,
		heals:0,
		tanks:0,
		damage:0,
		DPR:0
	};
	this.table = document.getElementById('game_holder');

	this.dpsInput = document.createElement('input');
	this.dpsInput.style.position = 'absolute';
	this.dpsInput.style.top = '20px';
	this.dpsInput.style.left = '10px';
	this.dpsInput.style.width = '20px';
	this.dpsInput.defaultValue = 4;

	this.dpsSpan = document.createElement('span');
	this.dpsSpan.innerHTML = 'DPS';
	this.dpsSpan.style.position = 'absolute';
	this.dpsSpan.style.top = '20px';
	this.dpsSpan.style.left = '50px';

	this.healsInput = document.createElement('input');
	this.healsInput.style.position = 'absolute';
	this.healsInput.style.top = '40px';
	this.healsInput.style.left = '10px';
	this.healsInput.style.width = '20px';
	this.healsInput.defaultValue = 2;

	this.healsSpan = document.createElement('span');
	this.healsSpan.innerHTML = 'HEALER';
	this.healsSpan.style.position = 'absolute';
	this.healsSpan.style.top = '40px';
	this.healsSpan.style.left = '50px';

	this.tankInput = document.createElement('input');
	this.tankInput.style.position = 'absolute';
	this.tankInput.style.top = '60px';
	this.tankInput.style.left = '10px';
	this.tankInput.style.width = '20px';
	this.tankInput.defaultValue = 2;

	this.tankSpan = document.createElement('span');
	this.tankSpan.innerHTML = 'TANK';
	this.tankSpan.style.position = 'absolute';
	this.tankSpan.style.top = '60px';
	this.tankSpan.style.left = '50px';

	this.rollInput = document.createElement('input');
	this.rollInput.style.position = 'absolute';
	this.rollInput.style.top = '80px';
	this.rollInput.style.left = '10px';
	this.rollInput.style.width = '20px';
	this.rollInput.defaultValue = 3;

	this.rollSpan = document.createElement('span');
	this.rollSpan.innerHTML = 'ROLLS';
	this.rollSpan.style.position = 'absolute';
	this.rollSpan.style.top = '80px';
	this.rollSpan.style.left = '50px';

	this.interInput = document.createElement('input');
	this.interInput.style.position = 'absolute';
	this.interInput.style.top = '100px';
	this.interInput.style.left = '10px';
	this.interInput.style.width = '20px';
	this.interInput.defaultValue = 40;

	this.iterSpan = document.createElement('span');
	this.iterSpan.innerHTML = 'ITERATION';
	this.iterSpan.style.position = 'absolute';
	this.iterSpan.style.top = '100px';
	this.iterSpan.style.left = '50px';

	this.dpsBtn = document.createElement('input');
	this.dpsBtn.style.position = 'absolute';
	this.dpsBtn.style.top = '140px';
	this.dpsBtn.style.left = '10px';
	this.dpsBtn.style.width = '60px';
	this.dpsBtn.type = 'button';
	this.dpsBtn.value = 'roll';
	this.dpsBtn.objref = this;

	this.rollResults = document.createElement('div');
	this.rollResults.style.position = 'absolute';
	this.rollResults.style.left = '135px';
	this.rollResults.style.top = '120px';
	this.rollResults.innerHTML = JSON.stringify(this.totals);

	this.dpsBtn.onclick = function(){
		this.objref.rollDice();
	}
	this.table.appendChild(this.dpsInput);
	this.table.appendChild(this.dpsSpan);	
	this.table.appendChild(this.healsInput);
	this.table.appendChild(this.healsSpan);	
	this.table.appendChild(this.tankSpan);
	this.table.appendChild(this.tankInput);	
	this.table.appendChild(this.iterSpan);
	this.table.appendChild(this.interInput);	
	this.table.appendChild(this.rollSpan);
	this.table.appendChild(this.rollInput);
	this.table.appendChild(this.dpsBtn);
	this.table.appendChild(this.rollResults);
	this.diceRender = document.createElement('div');
	this.diceRender.style.position = 'absolute';
	this.diceRender.style.width = '500px';
	this.diceRender.style.height = '400px';
	this.diceRender.style.top = '170px';
	this.diceRender.style.overflowY = 'scroll';
	this.table.appendChild(this.diceRender)
}
DiceRoller.prototype.setupDice = function(obj){

}
DiceRoller.prototype.rollDice = function(){
	this.allDice = [];

	var allTotals = {
		dps:0,
		heals:0,
		tanks:0,
		deaths:[],
		rolls:[],
		damage:[],
		healUsed:[],
		tauntUsed:[]
	};
	for(var i = 0; i < this.healsInput.value;i++){
		var dice = new Dice('healer');
		allTotals.heals++;
		this.allDice.push(dice);
	}	
	for(var i = 0; i < this.tankInput.value;i++){
		var dice = new Dice('tank');
		allTotals.tanks++;
		this.allDice.push(dice);
	}
	for(var i = 0; i < this.dpsInput.value;i++){
		var dice = new Dice('dps');
		allTotals.dps++;
		this.allDice.push(dice);
	}	
	if(this.allDice.length == 0)return;
	var j = 0;
	while(j < 1){
		var totals = {
			rolls:0,
			damage:0,
			healUsed:0,
			tauntUsed:0,
			deaths:0
		};
		var healup = 0;
		var tauntup = 0;
		while(!this.allDead()){
			if(totals.rolls >= this.rollInput.value || totals.damage >= this.interInput.value){break;}
			var outcomes = [];
			totals.rolls++;
			for(var i in this.allDice){
				if(!this.allDice[i].dead){
					var roll = this.allDice[i].roll();
					if(roll != 'H' && roll != 'T' && roll != 'X')
						totals.damage += roll;

					if(roll == 'X')
						this.allDice[i].pending = true;

					if(roll == 'H'){
						healup++;
					}

					if(roll == 'T'){
						tauntup++;
					}
				}else{
					roll = 0;
				}
				outcomes.push(roll);
			}
			console.log(outcomes);
			while(tauntup > 0){
				var rez = this.tauntPlayers();
				if(rez)totals.tauntUsed++;
				tauntup--;
			}
			while(healup > 0){
				var heal = this.healPlayer();
				if(heal)totals.healUsed++;
				healup--;
			}
			totals.deaths += this.killPending();
		}
		this.buildDiceRender();
		allTotals.damage.push(totals.damage);
		allTotals.rolls.push(totals.rolls);
		allTotals.healUsed.push(totals.healUsed);
		allTotals.tauntUsed.push(totals.tauntUsed);
		allTotals.deaths.push(totals.deaths);
		this.resetDice();
		console.log('_____________')
		j++;
	}
	var avgs = this.getAverages(allTotals);
	var exportTotals = {};
		exportTotals.damagePerRoll = Math.round(avgs.damage/avgs.rolls*100)/100;
		exportTotals.damage = Math.round(avgs.damage*100)/100;
		exportTotals.rolls = avgs.rolls;
		// this.totals.dps = allTotals.dps;
		// this.totals.heals = allTotals.heals;
		// this.totals.tanks = allTotals.tanks;
		exportTotals.deaths = Math.round(avgs.deaths*100)/100;
		exportTotals.healUsed = Math.round(avgs.healUsed*100)/100;
		exportTotals.tauntUsed = Math.round(avgs.tauntUsed*100)/100;
		this.rollResults.innerHTML = JSON.stringify(exportTotals, null, "\t");
}
DiceRoller.prototype.getAverages = function(obj){
	console.log(obj);
	var newObj = {damage:0,rolls:0,healUsed:0,tauntUsed:0,deaths:0};
	for(var i in obj.damage){
		newObj.damage += obj.damage[i];
	}	
	for(var i in obj.rolls){
		newObj.rolls += obj.rolls[i];
	}	
	for(var i in obj.healUsed){
		newObj.healUsed += obj.healUsed[i];
	}	
	for(var i in obj.tauntUsed){
		newObj.tauntUsed += obj.tauntUsed[i];
	}	
	for(var i in obj.deaths){
		newObj.deaths += obj.deaths[i];
	}
	newObj.rolls = newObj.rolls/obj.rolls.length;
	newObj.healUsed = newObj.healUsed/obj.healUsed.length;
	newObj.tauntUsed = newObj.tauntUsed/obj.tauntUsed.length;
	newObj.damage = newObj.damage/obj.damage.length;
	newObj.deaths = newObj.deaths/obj.deaths.length;

	return newObj;
}
DiceRoller.prototype.allDead = function(){
	var count = 0;
	for(var i in this.allDice){
		if(this.allDice[i].dead)
			count++;
	}
	if(count==this.allDice.length)console.log("OMGERRRRRRD")
	return count == this.allDice.length;
}
DiceRoller.prototype.resetDice = function(){
	var count = 0;
	for(var i in this.allDice){
		if(this.allDice[i].dead)
			this.allDice[i].dead = false;
	}
}
// DiceRoller.prototype.rezPlayer = function(){
// 	for(var i in this.allDice){
// 		if(this.allDice[i].dead){
// 			this.allDice[i].dead = false;
// 			this.allDice[i].pending = false;
// 			return true;
// 		}
// 	}
// 	return false;
// }
DiceRoller.prototype.tauntPlayers = function(){
	var bool = false;
	for(var i in this.allDice){
		if(this.allDice[i].pending){
			this.allDice[i].pending = false;
			bool = true;
		}
	}
	return bool;
}
DiceRoller.prototype.healPlayer = function(){
	for(var i in this.allDice){
		if(this.allDice[i].pending){
			this.allDice[i].pending = false;
			return true;
		}
	}
	return false;
}
DiceRoller.prototype.killPending = function(){
	var deathToll = 0;
	for(var i in this.allDice){
		if(this.allDice[i].pending){
			this.allDice[i].pending = false;
			this.allDice[i].dead = true;
			deathToll++;
		}
	}
	return deathToll;
}
DiceRoller.prototype.buildDiceRender = function(){

}
function Dice(type){
	this.dead = false;
	this.pending = false;
	this.type = type;
	switch(type){
		case 'dps':
			this.sides = ['X','X',3,2,2,1];
		break;
		case 'healer':
			this.sides = ['X',1,'H','H',1,1];
		break;
		case 'tank':
			this.sides = ['X',2,'T',2,1,1];
		break;
	}
}
Dice.prototype.roll = function(){
	return this.sides[Math.floor(Math.random()*this.sides.length)];
}
