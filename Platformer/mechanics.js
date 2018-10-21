'use strict';
var Game = {
	running: true,
	levelLimit: 500,
	baseX: 0,
	keys: ["w", "a", "d"],
	init: function(){
		for(var i = 0;i < Barriers.list.length; i++){
			var b = Barriers.list[i];
			var width = b[1] - b[0];
			var rounded = Math.round(width) + Math.round(width) % 5;
			var w = width / (rounded / 5);
			for (var j = 0; j < rounded / 5; j++){
				var names = ["grass", "fall", "graveyard"];
				var left = b[0] + j * w;
				//console.log(left);
				var top = b[2];
				var src = names[b[3] - 1] + "" + (j % 3 + 1) + ".png";
				Util.createImage(src, top, left, w, 5);
			}
		}
	},
	handleKeyPress: function(keyEvent){
		//up 38, down 40
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
		} else if (keyEvent.keyCode === 38) {
			if(Player.gunState !== PState.UNARMED) {
				if (Player.gunState === PState.GUN_DOWNWARDS) {
					Player.changeState(Player.movementState, PState.GUN_STRAIGHT);
				} else if (Player.gunState === PState.GUN_STRAIGHT) {
					Player.changeState(Player.movementState, PState.GUN_UPWARDS);
				}
			}
		} else if (keyEvent.keyCode === 40) {
			if(Player.gunState !== PState.UNARMED) {
				if (Player.gunState === PState.GUN_UPWARDS) {
					Player.changeState(Player.movementState, PState.GUN_STRAIGHT);
				} else if (Player.gunState === PState.GUN_STRAIGHT) {
					Player.changeState(Player.movementState, PState.GUN_DOWNWARDS);
				}
			}
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
	updateStyles: function () {
		//Player.sidewaysAmount
		//top, left, width, height
		if(Player.x > 50 && Player.x < Game.levelLimit - 50){
			Game.baseX = Player.x - 50;
		}
		$("#guy").css("top", Player.y + "%");
		$("#guy").css("left", Player.x - Game.baseX + "%");
		Player.updateImage();
		for (var i = 0;i < Util.imageList.length; i++) {
			var img = Util.imageList[i];
			//if (img[])
			$("#img" + i).css("left", img[1] - Game.baseX + "%");
		} 
	}
};

var PState = {
	STILL: 0,
	MOVING_LEFT: 1,
	MOVING_RIGHT: 2,
	UNARMED: 3,
	GUN_STRAIGHT: 4,
	GUN_DOWNWARDS: 5,
	GUN_UPWARDS: 6
};

var Player = {
	images: ["standing.PNG", "mistaSkelly.gif", 
	"straightStill.png", "straightWalking.gif",
	"downwardsStill.PNG", "downwardsWalking.gif", 
	"upwardsStill.PNG", "upwardsWalking.gif",
	],
	movementState: PState.STILL,
	gunState: PState.GUN_DOWNWARDS,
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
	updateImage: function () {
		if (Player.movementState === PState.STILL && Player.movingLeft) {
			Player.changeState(PState.MOVING_LEFT, Player.gunState);
		} else if (Player.movementState === PState.STILL && Player.movingRight) {
			Player.changeState(PState.MOVING_RIGHT, Player.gunState);
		} else if (Player.movementState === PState.MOVING_RIGHT && Player.movingLeft) {
			Player.changeState(PState.MOVING_LEFT, Player.gunState);
		} else if (Player.movementState === PState.MOVING_LEFT && Player.movingRight) {
			Player.changeState(PState.MOVING_RIGHT, Player.gunState);
		} else if (Player.movementState !== PState.STILL && !Player.movingLeft && !Player.movingRight) {
			Player.changeState(PState.STILL, Player.gunState);
		}
	},
	changeState: function (movementState, gunState) {
		Player.movementState = movementState;
		Player.gunState = gunState;
		if (movementState === PState.STILL) {
			if (gunState === PState.UNARMED){
				$("#guy img").attr("src", "Resources/" + Player.images[0]);
				//$("#guy img").css("transform", "none");
			} else if (gunState === PState.GUN_STRAIGHT){
				$("#guy img").attr("src", "Resources/" + Player.images[2]);
			} else if (gunState === PState.GUN_DOWNWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[4]);
			} else if (gunState === PState.GUN_UPWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[6]);
			}
		} else if (movementState === PState.MOVING_LEFT) {
			if (gunState === PState.UNARMED){
				$("#guy img").attr("src", "Resources/" + Player.images[1]);
			} else if (gunState === PState.GUN_STRAIGHT){
				$("#guy img").attr("src", "Resources/" + Player.images[3]);
			} else if (gunState === PState.GUN_DOWNWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[5]);
			} else if (gunState === PState.GUN_UPWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[7]);
			}
			$("#guy img").css("transform", "scaleX(-1)");
		} else if (movementState === PState.MOVING_RIGHT) {
			if (gunState === PState.UNARMED){
				$("#guy img").attr("src", "Resources/" + Player.images[1]);
			} else if (gunState === PState.GUN_STRAIGHT){
				$("#guy img").attr("src", "Resources/" + Player.images[3]);
			} else if (gunState === PState.GUN_DOWNWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[5]);
			} else if (gunState === PState.GUN_UPWARDS) {
				$("#guy img").attr("src", "Resources/" + Player.images[7]);
			}
			$("#guy img").css("transform", "none");
		}
	},
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
			if(Player.x < Game.levelLimit - Player.playerWidth) {
				Player.x += Player.sidewaysAmount;
			} else {
				Player.x = Game.levelLimit - Player.playerWidth;
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
	addBarrier: function(x1, x2, y, type){
		var b = [x1, x2, y, type];
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

var Util = {
	imageList: [],
	createImage: function(source, top, left, width, height){
		var data = [top, left, width, height];
		Util.imageList.push(data);
		var sString = "position:absolute;top:" + top + "%;left:" + left + "%;height:" + height + "%;width:" + width + "%;";
		var iString = "<img src='Resources/" + source + "' style='width:100%;height:100%;' />";
		$("<div id='img" + (Util.imageList.length - 1) + "'class='image' style='" + sString + "' >" + iString + "</div>").appendTo( "body" );
		return Util.imageList.length - 1;
	}
};