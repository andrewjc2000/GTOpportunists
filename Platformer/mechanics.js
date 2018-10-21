'use strict';
var Game = {
	theme: 2,
	running: true,
	levelLimit: 1500,
	baseX: 0,
	keys: ["w", "a", "d"],
	changeTheme: function(theme){
		Game.theme = theme;
		$("#background img").attr("src", "Resources/background" + theme + ".png");
	},
	click: function(button) {
		if (button <= 4) {
			var names = ["play", "controls", "themes", "credits", "back"];
			$("#" + names[button] + " img").attr("src", "Resources/" + names[button] + "Selected.PNG");
		} 
	},
	releaseClick: function (button) {
		if (button <= 3){
			var names = ["play", "controls", "themes", "credits", "back"];
			$("#" + names[button] + " img").attr("src", "Resources/" + names[button] + ".PNG");
			$("#buttons").css("display", "none");
			if (button === 0) {
				Game.init();
			} else if (button === 1){
				$("#controlInfo").css("display", "block");
				$("#back").css("display", "block");
			} else if (button === 2){
				$("#theme1").css("display", "block");
				$("#theme2").css("display", "block");
				$("#theme3").css("display", "block");
				$("#back").css("display", "block");
			} else if (button === 3){
				$("#back").css("display", "block");
			}
		} else if (button === 4) {
			$("#buttons").css("display", "block");
			$("#theme1").css("display", "none");
			$("#theme2").css("display", "none");
			$("#theme3").css("display", "none");
			$("#controlInfo").css("display", "none");
			$("#back img").attr("src", "Resources/back.PNG");
			$("#back").css("display", "none");
		}
	},
	init: function(){
		$("#candyCount").css("display", "block");
		$("#candyIcon").css("display", "block");
		$("<div id='ground' class='noSelect'> <img src='Resources/floor" + Game.theme + ".png'/> </div>").appendTo("body");
		$("<div id='guy' class='noSelect'> <img src='Resources/standing.PNG'/> </div>").appendTo("body");
		/*Barriers.addBarrier(110, 200, 70, 1);
        Barriers.addBarrier(45, 70, 60, 3);
        Image.createEnemy("crowFlappy.gif", 60, 70, 20, 20, 5, 5);
        Image.createEnemy("spiderTinySideways.gif", 60, 50, 5, 5, 5, 5);
		*/
		Gen.init();
		for (var i = 0;i < Player.health; i++){
			var iString = "<img src='Resources/heart.gif' style='width:100%;height:100%;' />";
			$("<div id='heart" + i + "' class='heart' style='left:" + (i * 4) +  "%' >" + iString + "</div>").appendTo("body");
		}
		for(var i = 0;i < Barriers.list.length; i++){
			var b = Barriers.list[i];
			var width = b[1] - b[0];
			var rounded = Math.round(width) + Math.round(width) % 5;
			var w = width / (rounded / 5);
			for (var j = 0; j < rounded / 5; j++){
				var names = ["graveyard", "fall", "grass"];
				var left = b[0] + j * w;
				//console.log(left);
				var top = b[2];
				var src = names[b[3] - 1] + "" + (j % 3 + 1) + ".png";
				Image.createBarrier(src, top, left, w, 5);
			}
		}

		$(window).bind("keydown", Game.handleKeyPress);
        $(window).bind("keyup", Game.handleKeyUp);
        window.setInterval(
            function(){
                if (Game.running){
                    Player.updatePosition();
                    Game.update();
                }
            }, 10
        );
	},
	handleKeyPress: function(keyEvent){
		//up 38, down 40
		console.log('yeet');
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
			if (Player.gunState !== PState.UNARMED && !Player.reloading){
				var facingLeft = $("#guy img").css("transform") !== "none";
				var x = facingLeft ? Player.x - 2 : Player.x + Player.playerWidth;
				var y = Player.y + Player.playerHeight / 2;
				var direction = 1;
				if (facingLeft) {
					direction--;
				}
				if (Player.gunState === PState.GUN_STRAIGHT) {
					direction += 2;
				} else if (Player.gunState === PState.GUN_DOWNWARDS) {
					direction += 4;
				}
				//console.log(direction);
				//straight, down , up (4, 5, 6)
				// 0 1
				// 2 3
				// 4 5
				Player.reloading = true;
				Image.createBullet(x, y, 1.5, direction);
			}
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
	update: function () {
		//Player.sidewaysAmount
		//top, left, width, height
		if(Player.x > 50 && Player.x < Game.levelLimit - 50){
			Game.baseX = Player.x - 50;
		}
		$("#guy").css("top", Player.y + "%");
		$("#guy").css("left", Player.x - Game.baseX + "%");
		Player.updateImage();
		for (var i = 0;i < Image.barrierList.length; i++) {
			var img = Image.barrierList[i];
			//if (img[])
			$("#img" + i).css("left", img[1] - Game.baseX + "%");
		}
		for (var i = 0;i < Image.candyList.length; i++) {
			var img = Image.candyList[i];
			$("#candy" + i).css("left", img[0] - Game.baseX + "%");
		}

		if (Player.reloading) {
			if (Player.reloadingProgress < 30) {
				Player.reloadingProgress++;
			} else {
				Player.reloadingProgress = 0;
				Player.reloading = false;
			}
		}

		if (Player.x >= Game.levelLimit - Player.playerWidth - 1) {
			Game.win();
		}

		Player.getCandies();
		Player.checkDamage();
		Image.updateEnemies();
		Image.updateBullets();
	},
	gameOver: function () {
		Game.running = false;
		$(window).unbind("keydown", Game.handleKeyPress);
        $(window).unbind("keyup", Game.handleKeyUp);
        $("<div id='gameOver'> <img src='Resources/gameOver.png' style='width:100%;height:100%;'/></div>").appendTo( "body" );
        $(".image").css("display", "none");
	},
	win: function () {
		Game.running = false;
		$(window).unbind("keydown", Game.handleKeyPress);
        $(window).unbind("keyup", Game.handleKeyUp);
        $("<div id='win'> <img src='Resources/win.png' style='width:100%;height:100%;'/></div>").appendTo( "body" );
        $(".image").css("display", "none");
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
	health: 5,
	maxHealth: 5,
	damageProgress: 0,
	reloadingProgress: 0,
	reloading: false,
	takingDamage: false,
	candyAmount: 0,
	checkDamage: function (){
		var x1 = Player.x;
		var y1 = Player.y;
		var x2 = Player.x + Player.playerWidth;
		var y2 = Player.y + Player.playerHeight;
		if (!Player.takingDamage){
			for (var i = 0;i < Image.enemyList.length; i++){
				//var data = [x, y, width, height, health, maxHealth, Image.enemyCount, true, 0];
				var enemy = Image.enemyList[i];
				if (
					((x1 >= enemy[0] && y1 >= enemy[1] && x1 <= enemy[0] + enemy[2] && y1 <= enemy[1] + enemy[3]) || 
					(x2 >= enemy[0] && y2 >= enemy[1] && x2 <= enemy[0] + enemy[2] && y2 <= enemy[1] + enemy[3]))
					&& enemy[7]
				) {
					Player.takingDamage = true;
					Player.damageProgress = 0;
					Player.health--;
					Player.updateHearts();
					if (Player.health <= 0) {
						Game.gameOver();
					}
				}
			}
		} else {
			Player.damageProgress++;
			if (Player.damageProgress >= 200){
				$("#guy").css("opacity", "1.0");
				Player.takingDamage = false;
				Player.damageProgress = 0;
			} else if (Player.damageProgress % 40 === 0) {
				$("#guy").css("opacity", "1.0");
			} else if (Player.damageProgress % 20 === 0){
				$("#guy").css("opacity", "0.5");
			}
		}
	},
	getCandies: function () {
		var testX = Player.x + Player.playerWidth / 2;
		var testY = Player.y + Player.playerHeight;
		for (var i = 0;i < Image.candyList.length; i++) {
			var candy = Image.candyList[i];
			if (testX >= candy[0] && testX <= candy[0] + 3 && testY >= candy[1] && testY <= candy[1] + 4) {
				Image.collectCandy(i);
			}
		}
	},
	updateHearts: function () {
		for (var i = Player.maxHealth - 1;i >= Player.health; i--){
			$("#heart" + i + " img").attr("src", "Resources/deadHeart.PNG");
		}
	},
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

var Image = {
	barrierList: [],
	bulletList: [],
	enemyList: [],
	candyList: [],
	bulletCount: 0,
	enemyCount: 0,
	candyCount: 0,
	createCandy: function(source, x, y){
		var data = [x, y, Image.candyCount];
		Image.candyList.push(data);
		var sString = "position:absolute;top:" + y + "%;left:" + x + "%;height:1.5%;width:3%;";
		var iString = "<img src='Resources/" + source + "' style='width:100%;height:100%;' />";
		$("<div id='candy" + Image.candyCount + "' class='image' style='" + sString + "' >" + iString + "</div>").appendTo( "body" );
		Image.candyCount++;
	},
	collectCandy: function(index) {
		Player.candyAmount++;
		$("#candyCount").html("" + Player.candyAmount);
		$("#candy" + Image.candyList[index][2]).remove();
		Image.candyList.splice(index, 1);
	},
	createBarrier: function(source, top, left, width, height){
		var data = [top, left, width, height];
		Image.barrierList.push(data);
		var sString = "position:absolute;top:" + top + "%;left:" + left + "%;height:" + height + "%;width:" + width + "%;";
		var iString = "<img src='Resources/" + source + "' style='width:100%;height:100%;' />";
		$("<div id='img" + (Image.barrierList.length - 1) + "'class='image' style='" + sString + "' >" + iString + "</div>").appendTo( "body" );
		return Image.barrierList.length - 1;
	},
	createBullet: function(x, y, speed, dir) {
		var data = [x, y, speed, dir, Image.bulletCount];
		Image.bulletList.push(data);
		var sString = "position:absolute;top:" + y + "%;left:" + (x - Game.baseX) + "%;height:2%;width:2%;";
		var iString = "<img src='Resources/bullet.PNG' style='width:100%;height:100%;' />";
		$("<div id='bullet" + Image.bulletCount + "'class='image' style='" + sString + "' >" + iString + "</div>").appendTo( "body" );
		Image.bulletCount++;
	},
	createEnemy: function(source, x, y, width, height, health, maxHealth){

		//Current Enemies:
		//Crow
		//Tiny Spider
		//Spider

		var name;

		if (source === "crowFlappy.gif") {
			name = "crow";
		} else if (source === "spiderTinyJump.gif" || source === "spiderTinySideways.gif") {
			name = "tiny_spider";
		} else if (source === "spider.gif"){
			name = "spider";
		} else {
			name = "none";
		}

		var data = [x, y, width, height, health, maxHealth, Image.enemyCount, true, 0, name];
					//x, y, width, height, currentHealth, maxHealth, id number, currently alive, deadAnim progress, name
		Image.enemyList.push(data);
		var sString = "position:absolute;top:" + y + "%;left:" + x + "%;height:" + height + "%;width:" + width + "%;";
		var iString = "<img src='Resources/" + source + "' style='width:100%;height:100%;' />";
		$("<div id='enemy" + Image.enemyCount + "'class='image' style='" + sString + "' >" + iString + "</div>").appendTo( "body" );
		Image.enemyCount++;
	},
	enemiesWithDeadAnims: ["crow", "tiny_spider", "spider"],
	deadAnims: ["deadCrow.PNG", "deadTinySpider.PNG", "deadSpider.PNG"],
	updateEnemies: function(){
		var bulletsToRemove = [];
		var enemiesToRemove = [];
		for(var i = 0;i < Image.enemyList.length; i++) {
			var enemy = Image.enemyList[i];
			$("#enemy" + enemy[6]).css("left", enemy[0] - Game.baseX + "%");
			if (enemy[7]) {
				for (var j = 0;j < Image.bulletList.length; j++) {
					var bullet = Image.bulletList[j];
					if (bullet[0] >= enemy[0] && bullet[0] <= enemy[0] + enemy[2] 
						&& bullet[1] >= enemy[1] && bullet[1] <= enemy[1] + enemy[3]
						){
						Image.enemyList[i][4]--;
						$("#bullet" + bullet[4]).remove();
						bulletsToRemove.push(j);
						if (Image.enemyList[i][4] <= 0) {
							Image.enemyList[i][7] = false;
						}
					}
				}
			}
			else {
				if (enemy[8] < 50) {
					Image.enemyList[i][8]++;
					if (enemy[8] % 20 === 0){
						$("#enemy" + Image.enemyList[i][6]).css("opacity", "1.0");
					} else if (enemy[8] % 10 === 0) {
						$("#enemy" + Image.enemyList[i][6]).css("opacity", "0.5");
					}
				} else if (Image.enemiesWithDeadAnims.indexOf(enemy[9]) !== -1 && enemy[8] < 200) {
					Image.enemyList[i][8]++;
					if(enemy[8] === 100) {
						var source = "Resources/" + Image.deadAnims[Image.enemiesWithDeadAnims.indexOf(enemy[9])];
						$("#enemy" + Image.enemyList[i][6] + " img").attr("src", source);
					} else if (enemy[8] === 150) {
						$("#enemy" + Image.enemyList[i][6] + " img").css("transform", "rotate(180deg)");
					}
				}
				else {
					$("#enemy" + Image.enemyList[i][6]).remove();
					enemiesToRemove.push(i);
				}
			}
		}
		for(var i = 0; i < bulletsToRemove.length; i++) {
			Image.bulletList.splice(bulletsToRemove[i] - i, 1);
		}

		for(var i = 0; i < enemiesToRemove.length; i++) {
			Image.enemyList.splice(enemiesToRemove[i] - i, 1);
		}
	},
	updateBullets: function(){
		var indecesToRemove = [];
		for(var i = 0;i < Image.bulletList.length; i++){
			var bullet = Image.bulletList[i];
			var maxX = (Game.baseX === 0) ? 100 : Player.x + 50;
			//console.log(bullet[1]);
			if(bullet[0] < Game.baseX || bullet[0] > maxX || bullet[1] < 0 || bullet[1] > 94) {
				$("#bullet" + bullet[4]).remove();
				indecesToRemove.push(i);
			} else {
				var speed = bullet[2];
				var direction = bullet[3];
				Image.bulletList[i][0] +=  (direction % 2 === 0) ? -speed : speed;
				if (direction < 2) {
					Image.bulletList[i][1] += -speed;
				} else if (direction > 3) {
					Image.bulletList[i][1] += speed;
				} 
				$("#bullet" + bullet[4]).css("left", Image.bulletList[i][0] - Game.baseX + "%");
				$("#bullet" + bullet[4]).css("top", Image.bulletList[i][1] + "%");
			}
		}
		for(var i = 0; i < indecesToRemove.length; i++) {
			Image.bulletList.splice(indecesToRemove[i] - i, 1);
		}
	}
};

/*var Bullets = {
	bulletList: [],
	fireBullet: function(x, y, speed, dir) {
		// directions:
		//  0   1
		//  2 O 3
		//  4   5

		var arr = [x, y, speed, dir, imageIndex];
		Bullets.bulletList.push(arr);
	}
};*/