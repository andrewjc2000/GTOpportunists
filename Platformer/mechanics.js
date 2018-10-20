'use strict';
var Game = {
	running: true,
	keys: ["w", "a", "d"],
	handleKeyPress: function(keyEvent){
		if(Game.keys.indexOf(keyEvent.key) !== -1){
			var dir = Game.keys.indexOf(keyEvent.key);
			if(dir === 0){
				Player.jumping = true;
			} else if(dir === 1){
				if(!Player.movingLeft) {
					Player.movingLeft = true;
					if(Player.movingRight) {
						Player.movingRight = false;
					}
				}
			} else if (dir === 2) {
				if(!Player.movingRight) {
					Player.movingRight = true;
					if(Player.movingLeft) {
						Player.movingLeft = false;
					}
				}
			}

		} else if (keyEvent.keyCode === 32) {
			Player.jumping = true;
		}
	},
	handleKeyUp: function(keyEvent) {
		if(Game.keys.indexOf(keyEvent.key) !== -1){
			var dir = Game.keys.indexOf(keyEvent.key);
			if(dir === 1){
				if(Player.movingLeft) {
					Player.movingLeft = false;
				}
			} else if (dir === 2) {
				if(Player.movingRight) {
					Player.movingRight = false;
				}
			}

		}
	},
	updatePositions: function () {
		$("#guy").css("top", Player.y + "%");
		$("#guy").css("left", Player.x + "%");
	}
};

var Player = {
	playerWidth: 5,
	playerHeight: 17,
	sidewaysAmount: .3,
	upwardsAmount: 37,
	movingLeft: false,
	movingRight: false,
	jumping: false,
	jumpHeight: 32,
	jumpProgress: 0,
	onBarrier: false,
	baseY: 80,
	x: 0,
	y: 80,
	updatePosition: function () {

		if(Player.onBarrier){
			var testX = Player.x + Player.playerWidth / 2;
			var testY = Player.y + Player.playerHeight;
			var platform = Barriers.insideBarrier(testX, testY);
			if(!platform) {
				if(!Player.jumping){
					Player.jumping = true;
					Player.jumpProgress = 50;
					Player.baseY = 80;
					Player.onBarrier = false;
					//alert('falling');
				}
			} else {
				if(Player.jumping) {
					if(Player.jumpProgress < 100){
						Player.jumpProgress++;
						var h = Player.upwardsAmount;
						var p = Player.jumpProgress;
						Player.y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
					} 
					else {
						Player.jumping = false;
						Player.jumpProgress = 0;
						Player.y = Player.baseY;
					}
				}
				if(Player.movingLeft) {
					if(Player.x > 0) {
						Player.x -= Player.sidewaysAmount;
					} else {
						Player.x = 0;
						Player.movingLeft = false;
					}
				}
				if(Player.movingRight) {
					if(Player.x < 100 - Player.playerWidth) {
						Player.x += Player.sidewaysAmount;
					} else {
						Player.x = 100 - Player.playerWidth;
						Player.movingRight = false;
					}
				}
			}
		}
		else {
			if(Player.jumping) {
				var testX = Player.x + Player.playerWidth;
				var testY = Player.y + Player.playerHeight;
				var platform = Barriers.insideBarrier(testX, testY);
				if (!platform) {
					if(Player.jumpProgress < 100){
						Player.jumpProgress++;
						var h = Player.upwardsAmount;
						var p = Player.jumpProgress;
						Player.y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
					}
					else {
						Player.jumping = false;
						Player.jumpProgress = 0;
					}
				}
				else {
					Player.jumping = false;
					Player.jumpProgress = 0;
					Player.y = platform[1] - Player.playerHeight;
					Player.onBarrier = true;
					Player.baseY = Player.y;
				}
			}
			if(Player.movingLeft) {
				if(Player.x > 0) {
					var testX = Player.x;
					var testY = Player.y + Player.playerHeight;
					if (!Barriers.insideBarrier(testX, testY)) {
						Player.x -= Player.sidewaysAmount;
					} 
				} else {
					Player.x = 0;
					Player.movingLeft = false;
				}
			}
			if(Player.movingRight) {
				if(Player.x < 100 - Player.playerWidth) {
					var testX = Player.x + Player.playerWidth + 1;
					var testY = Player.y + Player.playerHeight + 1;
					if (!Barriers.insideBarrier(testX, testY)) {
						Player.x += Player.sidewaysAmount;
					} 
				} else {
					Player.x = 100 - Player.playerWidth;
					Player.movingRight = false;
				}
			}
		}
		
	}
};

var Barriers = {
	list: [],
	addBarrier: function(x1, y1, x2, y2){
		var b = [x1, y1, x2, y2];
		Barriers.list.push(b);
	},
	insideBarrier: function(x, y){
		for(var i = 0;i < Barriers.list.length; i++){
			var b = Barriers.list[i];
			if(x >= (b[0]) && x <= (b[2]) && y >= (b[1]) && y <= (b[3])){
				return b;
			}
		}
		return false;
	}
};