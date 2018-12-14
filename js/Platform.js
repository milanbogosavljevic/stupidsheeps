
this.system = this.system || {};
(function(){
    "use strict";

    var Platform = function(game){
        this.Container_constructor();
        this.initPlatform(game);
    };

    var p = createjs.extend(Platform,createjs.Container);
    p.game = null;
    p.bridge = null;
    p.bridgePositions = null;
    p.sheepPositions = null;
    p.sheep1 = null;
    p.sheep2 = null;

    p.initPlatform = function (game) {
        //console.log("Platform Initialized...");
        this.game = game;
        this.bridge = system.CustomMethods.makeImage("bridge" , false);
        this.bridge.regX = this.bridge.image.width/2;

        this.sheepPositions = [-45 , 45 , 135 , 225 , 315 , 405 , 495 , 585 , 675 , 765 , 855 , 945 , 1035 , 1125];

        this.sheep1 = system.CustomMethods.makeImage("sheep" , false);
        this.sheep1.regX = this.sheep1.image.width/2;
        this.sheep1.y = -58;

        this.sheep2 = system.CustomMethods.makeImage("sheep" , false);
        this.sheep2.regX = this.sheep2.image.width/2;
        this.sheep2.y = -58;

        this.addChild(this.bridge,this.sheep1,this.sheep2);
    };

    p.setSheepsStartPosition = function (first , second) {
        this.sheep1.x = this.sheepPositions[first[0]];
        this.sheep1.isGoingLeft = first[1];
        this.sheep1.scaleX = first[1] === true ? -1 : 1;

        this.sheep2.x = this.sheepPositions[second[0]];
        this.sheep2.isGoingLeft = second[1];
        this.sheep2.scaleX = second[1] === true ? -1 : 1;
    };

    p.moveSheeps = function(){
        this.moveSheep(this.sheep1);
        this.moveSheep(this.sheep2);
    };

    p.moveSheep = function(sheep) {
        var sheepCurrentPos = this.sheepPositions.indexOf(sheep.x);
        var newPosition;
        if(sheep.isGoingLeft === true){
            if(sheepCurrentPos === 0){
                sheep.isGoingLeft = false;
                sheep.scaleX = 1;
                sheep.x = this.sheepPositions[1];
            }else{
                newPosition = sheepCurrentPos - 1;
                sheep.x = this.sheepPositions[newPosition];
            }
        }else{
            if(sheepCurrentPos === (this.sheepPositions.length - 1)){
                sheep.isGoingLeft = true;
                sheep.scaleX = -1;
                sheep.x = this.sheepPositions[this.sheepPositions.length - 2];
            }else{
                newPosition = sheepCurrentPos + 1;
                sheep.x = this.sheepPositions[newPosition];
            }
        }
        this.checkDangerFields(sheep);
    };

    p.checkDangerFields = function (sheep) {
        if(sheep.x === this.bridgePositions[0] || sheep.x === this.bridgePositions[1]){
            if(sheep.x !== this.bridge.x){
                this.game.sheepLost();
                createjs.Tween.get(sheep).to({alpha:0},100).to({alpha:1},100).to({alpha:0},100).to({alpha:1},100);
            }
        }
    };

    p.moveBridge = function () {
        this.bridge.x = this.bridge.x === this.bridgePositions[0] ? this.bridgePositions[1] : this.bridgePositions[0];
        this.checkDangerFields(this.sheep1);
        this.checkDangerFields(this.sheep2);
    };

    p.setBridgePositions = function (first,second) {
        this.bridgePositions = [this.sheepPositions[first],this.sheepPositions[second]];
    };

    system.Platform = createjs.promote(Platform,"Container");
})();


