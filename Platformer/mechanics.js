'use strict';
var Game = {
	running: true,
	keys: ["w", "a", "d"],
	init: function(){

	},
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
	playerWidth: 3,
	playerHeight: 15,
	sidewaysAmount: .3,
	upwardsAmount: 30,
	movingLeft: false,
	movingRight: false,
	jumping: false,
	falling: false,
	fallProgress: 0,
	jumpHeight: 20,
	jumpProgress: 0,
	onBarrier: false,
	groundY: 75,
	baseY: 75,
	x: 0,
	y: 75,
	updatePosition: function () {

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

		var testX = Player.x + Player.playerWidth / 2;
		var testY = Player.y + Player.playerHeight;
		$("#box").css("left", testX + "%");
		$("#box").css("top", testY + "%");
		var platform = Barriers.insideBarrier(testX, testY);

		if (!platform && Player.onBarrier && !Player.falling && !Player.jumping) {
			Player.onBarrier = false;
			Player.falling = true;
			Player.fallProgress = 100;
			Player.y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
		}

		if (Player.falling) {
			if (platform) {
				Player.falling = false;
				Player.fallProgress = 0;
				Player.onBarrier = true;
				Player.y = platform[2] - Player.playerHeight;
				Player.baseY = Player.y;
			} else if (Player.y + Player.playerHeight >= Player.groundY) {
				Player.placeOnGround();
			} else {
				Player.fallProgress++;
				var h = Player.upwardsAmount;
				var p = Player.fallProgress;
				var y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
				if (y + Player.playerHeight >= Player.groundY) {
					Player.placeOnGround();
				} else {
					Player.y = y;
				}
			}

		} 
		if (Player.jumping) {
			if (platform && Player.jumpProgress >= 50) {
				Player.jumping = false;
				Player.jumpProgress = 0;
				Player.baseY = platform[2] - Player.playerHeight;
				Player.y = Player.baseY;
				Player.onBarrier = true;
			}
			else if(Player.jumpProgress < 100){
				Player.jumpProgress++;
				var h = Player.upwardsAmount;
				var p = Player.jumpProgress;
				Player.y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
			}
			else {
				Player.jumping = false;
				Player.jumpProgress = 0;
				if (!platform && Player.onBarrier) {
					Player.onBarrier = false;
					Player.falling = true;
					Player.fallProgress = 100;
					Player.y = Player.baseY - ((-h/2500) * (p * p) + (h/25) * p);
				}
			}
		}
		
	},
	placeOnGround: function() {
		Player.falling = false;
		Player.jumping = false;
		Player.jumpProgress = 0;
		Player.fallProgress = 0;
		Player.onBarrier = false;
		Player.baseY = Player.groundY;
		Player.y = Player.baseY;
	}
};

var Barriers = {
	list: [],
	addBarrier: function(x1, x2, y){
		var b = [x1, x2, y];
		Barriers.list.push(b);
	},
	insideBarrier: function(x, y){
		for(var i = 0;i < Barriers.list.length; i++){
			var b = Barriers.list[i];
			if(x >= b[0] && x <= b[1] && y >= b[2] && y <= b[2] + 2){
				return b;
			}
		}
		return false;
	}
};