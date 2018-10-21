'use strict';
var Gen = {
    init: function() {

        var xOffset = 40;
        var minWidth = 15;
        var maxWidth = 95;
        var randomWidth = minWidth - 10;

        for (var y = 10;y <= 85; y += 25) {
            var probability = Math.sqrt(y) / Math.sqrt(250);
            for (var x = xOffset;x < Game.levelLimit - 30; x++) {
                if (Math.random() < probability) {
                    randomWidth = minWidth + Math.floor(Math.random() * (maxWidth - minWidth));
                    Barriers.addBarrier(x, x + randomWidth, y, Game.theme);
                    var random = Math.random();
                    if (random >= .9) {
                        var isCrow = Math.random() >= .5;
                        var h = isCrow ? 30 : 20;
                        Image.createEnemy(isCrow ? "crowFlappy.gif" : "spider.gif", x + randomWidth / 2, y - 15, 15, 15, h, h);
                        var isTinyJump = Math.random() >= .5;
                        Image.createEnemy(isTinyJump ? "spiderTinyJump.gif" : "spiderTinySideways.gif", x + randomWidth / 5, y - 5, 8, 5, h, h);
                        Image.createEnemy(isTinyJump ? "spiderTinySideways.gif" : "spiderTinyJump.gif", x + 4 * randomWidth / 5, y - 8, 8, 5, h, h);
                    } else if (random >= .7){
                        var isCrow = Math.random() >= .5;
                        var h = isCrow ? 30 : 20;
                        Image.createEnemy(isCrow ? "crowFlappy.gif" : "spider.gif", x + randomWidth / 2, y - 15, 15, 15, h, h);
                        var isTinyJump = Math.random() >= .5;
                        var num = Math.random() >= .5 ? 4 : 1;
                        Image.createEnemy(isTinyJump ? "spiderTinyJump.gif" : "spiderTinySideways.gif", x + num * randomWidth / 5, y - 5, 8, 5, h, h);
                    } else if (random >= .5) {
                        var isTinyJump = Math.random() >= .5;
                        var num = Math.random() >= .5 ? 4 : 1;
                        Image.createEnemy(isTinyJump ? "spiderTinyJump.gif" : "spiderTinySideways.gif", x + num * randomWidth / 5, y - 5, 8, 5, h, h);
                    }

                    for (var i = 0;i < 10; i++) {
                        if (Math.random() > .8) {
                            var src = "candy" + (1 + Math.floor(Math.random() * 3)) + ".PNG";
                            Image.createCandy(src, x + i * randomWidth / 10, y - 2);
                        }
                    }
                }
                x += randomWidth + 10;
            }
        }

    }
}
