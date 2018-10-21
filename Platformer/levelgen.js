'use strict';
var Gen = {
    init: function() {
        var xOffset = 40;
        var minWidth = 15;
        var maxWidth = 95;
        var gen = true;
        var curRow = 1;

        var gameLength = 500;

        var width = 0;

        while(gen) {
            if (curRow === 0) {
                if (!(Math.floor(Math.random() * 4) === 0)) { // 75% chance of generating a barrier

                }
            } else if (curRow === 1) { // between 65 and 70
                if (!(Math.floor(Math.random() * 4) === 0)) { // 75% chance of generating a barrier
                    width = (Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth);
                    if (xOffset + width <= gameLength) { // if we have space to generate another barrier
                        Barriers.addBarrier(xOffset, xOffset + width, Math.floor(Math.random() * 6) + 65, Math.floor(Math.random() * 3) + 1);
                        xOffset += (width + 10);

                        if (!(Math.floor(Math.random() * 2) === 0)) { // 50% chance of generating an enemy

                        }
                    } else { // if we don't have space, reset for next row
                        curRow = 2;
                        xOffset = 40;
                        maxWidth = 75; // upper rows are shorter
                    }
                } else { // no generation = push forward some
                    xOffset += 20;
                }
            } else if (curRow === 2) { // between 55 and 60
                if ((Math.floor(Math.random() * 4) === 0)) { // 25% chance of generating a barrier
                    width = (Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth);
                    if (xOffset + width <= gameLength) { // if we have space to generate another barrier
                        Barriers.addBarrier(xOffset, xOffset + width, Math.floor(Math.random() * 6) + 55, Math.floor(Math.random() * 3) + 1);
                        xOffset += (width + 10);

                        if ((Math.floor(Math.random() * 4) === 0)) { // 25% chance of generating an enemy

                        }
                    } else { // if we don't have space, we're done
                        gen = false;
                    }
                } else { // no generation = push forward some
                    xOffset += 20;
                }
            }
        }
    }
}
