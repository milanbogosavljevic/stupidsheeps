
this.system = this.system || {};
(function(){
    "use strict";

    var Game = function(){
        this.Container_constructor();
        this.initGame();
    };

    var p = createjs.extend(Game,createjs.Container);
    var that;

    p.platformsArr = null;
    p.movingInterval = null;
    p.intervalSpeed = null;
    p.counterForIntervalDecrement = 0;
    p.maxSpeedReached = false;
    p.livesNum = null;
    p.livesImgsArr = null;
    p.scoreNum = null;
    p.scoreText = null;
    p.finalScoreTxt = null;
    p.highscoreNum = null;
    p.highscoreText = null;
    p.gameIsPaused = false;
    p.restartButton = null;
    p.counterText = null;

    p.initGame = function () {
        that = this;
        this.intervalSpeed = 3000;
        this.livesNum = 3;
        this.scoreNum = 0;
        this.highscoreNum = Number(localStorage.getItem("highscore") || 0);

        this.setBackground();
        this.setPlatforms();
        this.setSideBackground();
        this.setButtons();
        this.setLives();
        this.setScore();
        this.setRestartOverlay();
        this.setCounter();
        this.setWelcomeSection();
    };

    p.setCounter = function() {
        var counter = this.counterText = system.CustomMethods.makeText("3" , "100px Teko" , "#ffffff" , "center" , "middle");
        counter.x = 640;
        counter.y = 64;
        counter.visible = false;
        this.addChild(counter);
    };

    p.animateCounter = function() {
        var counterNum = Number(this.counterText.text);
        this.counterText.visible = true;
        var countinInterval = setInterval(function () {
            counterNum--;
            that.counterText.text = counterNum;
            if(counterNum === 0){
                clearInterval(countinInterval);
                that.counterText.visible = false;
                that.counterText.text = 3;
            }
            console.log("updating");
        },1000);
    };

    p.setWelcomeSection = function() {
        var background = system.CustomMethods.makeImage("welcome" , false);
        var button = system.CustomMethods.makeImage("playButton" , true);
        button.x = 408;
        button.y = 540;
        button.addEventListener("click" , function () {
            if(is.mobile()){
                that.checkFs();
            }
            that.removeChild(background,button);
            that.animateCounter();
            that.startInterval();
        });
        this.addChild(background,button);
    };

    p.checkFs = function() {
        if(!window.parent.document.fullscreenElement){
            document.documentElement.requestFullscreen();
        }
    };

    p.setBackground = function () {
        var background = system.CustomMethods.makeImage("background" , false);
        this.addChild(background);
    };

    p.setSideBackground = function() {
        var sideBackground = system.CustomMethods.makeImage("right_sidebar" , false);
        sideBackground.x = 1080;
        this.addChild(sideBackground);
    };

    p.setPlatforms = function () {
        this.platformsArr = [];
        var platform1 = new system.Platform(this);
        platform1.y = 184;
        platform1.setBridgePositions(4,8); // 0 = index of possitions arr
        platform1.setSheepsStartPosition([6,false],[3,true]); // 0 = index of possitions arr , 1 = isGoingLeft
        platform1.moveBridge();

        var platform2 = new system.Platform(this);
        platform2.y = 355;
        platform2.setBridgePositions(3,7); // 0 = index of possitions arr
        platform2.setSheepsStartPosition([4,false],[10,true]); // 0 = index of possitions arr , 1 = isGoingLeft
        platform2.moveBridge();

        var platform3 = new system.Platform(this);
        platform3.y = 526;
        platform3.setBridgePositions(5,10); // 0 = index of possitions arr
        platform3.setSheepsStartPosition([1,false],[8,true]); // 0 = index of possitions arr , 1 = isGoingLeft
        platform3.moveBridge();

        this.platformsArr.push(platform1,platform2,platform3);
        this.addChild(platform1,platform2,platform3);
    };

    p.setButtons = function () {
        var bridgeButton1 = system.CustomMethods.makeImage("button" , true);
        bridgeButton1.name = 0;
        bridgeButton1.addEventListener("click" , this.onBridgeButton);
        bridgeButton1.x = 1128;
        bridgeButton1.y = 152;

        var bridgeButton2 = bridgeButton1.clone();
        bridgeButton2.name = 1;
        bridgeButton2.x = 1128;
        bridgeButton2.y = 323;
        bridgeButton2.addEventListener("click" , this.onBridgeButton);

        var bridgeButton3 = bridgeButton1.clone();
        bridgeButton3.name = 2;
        bridgeButton3.x = 1128;
        bridgeButton3.y = 494;
        bridgeButton3.addEventListener("click" , this.onBridgeButton);

        var restartButton = system.CustomMethods.makeImage("inGameRestartButton" , true);
        var hit = new createjs.Shape();
        hit.graphics.beginFill("black").drawRect(0,0,restartButton.image.width,restartButton.image.height);
        restartButton.hitArea = hit;
        restartButton.x = 38;
        restartButton.y = 23;
        restartButton.addEventListener("click" , this.onInGameRestartButton);

        this.addChild(bridgeButton1,bridgeButton2,bridgeButton3,restartButton);
    };

    p.setRestartOverlay = function() {
        var overlay = this.gameoverOverlay = system.CustomMethods.makeImage("overlay" , false);
        overlay.visible = false;

        var score = this.finalScoreTxt = system.CustomMethods.makeText("25" , "90px Teko" , "#ffffff" , "center" , "middle");
        score.x = 640;
        score.y = 346;
        score.visible = false;

        var restartButton = this.restartButton = system.CustomMethods.makeImage("restartButton" , true);
        restartButton.addEventListener("click" , this.onRestartButton);
        restartButton.x = 408;
        restartButton.y = 418;
        restartButton.visible = false;

        this.addChild(overlay,restartButton,score);
    };

    p.onBridgeButton = function (e) {
        if(!that.gameIsPaused){
            var ind = e.target.name;
            that.platformsArr[ind].moveBridge();
        }
    };

    p.onRestartButton = function() {
        that.restartButton.visible = false;
        that.gameoverOverlay.visible = false;
        that.finalScoreTxt.visible = false;
        that.maxSpeedReached = false;
        that.restartGame();
    };

    p.onInGameRestartButton = function() {
        if(that.counterText.visible === false){
            that.restartGame();
        }
    };

    p.restartGame = function() {
        that.livesNum = 3;
        that.scoreNum = 0;
        that.restartLivesImgs();
        that.updateScoreText();
        that.pauseGame(false);
        that.restartInterval(3000);
        that.animateCounter();
    };

    p.setLives = function () {
        this.livesImgsArr = [];
        var yPos = 25;

        var lifeImg = system.CustomMethods.makeImage("life" , false);
        lifeImg.x = 983;
        lifeImg.y = yPos;

        var lifeImg2 = lifeImg.clone();
        lifeImg2.x = lifeImg.x + 30;

        var lifeImg3 = lifeImg.clone();
        lifeImg3.x = lifeImg2.x + 30;

        this.livesImgsArr.push(lifeImg,lifeImg2,lifeImg3);
        this.addChild(lifeImg,lifeImg2,lifeImg3);
    };

    p.updateLivesImgs = function() {
        this.livesImgsArr[this.livesNum].visible = false;
    };
    
    p.restartLivesImgs = function() {
        for(var i = 0; i < this.livesImgsArr.length; i++){
            this.livesImgsArr[i].visible = true;
        }
    };

    p.setScore = function () {
        this.highscoreText = system.CustomMethods.makeText(this.highscoreNum , "30px Teko" , "#ffcc00" , "left" , "middle");
        this.highscoreText.x = 276;
        this.highscoreText.y = 36;

        this.scoreText = system.CustomMethods.makeText(this.scoreNum , "30px Teko" , "#ffcc00" , "left" , "middle");
        this.scoreText.x = 224;
        this.scoreText.y = 74;

        this.addChild(this.scoreText,this.highscoreText);
    };
    
    p.incrementScore = function() {
        this.scoreNum += 10;
        this.updateScoreText();
        if(!this.maxSpeedReached){
            this.checkSpeed();
        }
    };

    p.checkSpeed = function() {
        //console.log("check speed");
        this.counterForIntervalDecrement++;
        if(this.counterForIntervalDecrement > 5){
            this.counterForIntervalDecrement = 0;
            this.speedUp();
        }
    };

    p.updateScoreText = function () {
        this.scoreText.text = this.scoreNum;
    };

    p.updateHighscoreText = function() {
        this.highscoreText.text = this.highscoreNum;
    };

    p.checkHighscore = function() {
        if(this.scoreNum > this.highscoreNum){
            this.highscoreNum = this.scoreNum;
            this.updateHighscoreText();
            var newHighscore = String(this.scoreNum);
            localStorage.setItem("highscore" , newHighscore);
        }
    };

    p.sheepLost = function () {
        if(this.livesNum > 0){
            this.livesNum--;
            this.updateLivesImgs();
            if(this.livesNum === 0){
                this.onGameOver();
            }
        }
    };

    p.moveSheeps = function() {
        if(!that.gameIsPaused){
            that.incrementScore();
            for(var i = 0; i < that.platformsArr.length; i++){
                that.platformsArr[i].moveSheeps();
            }
        }
    };

    p.onGameOver = function() {
        this.pauseGame(true);
        this.checkHighscore();
        this.finalScoreTxt.text = this.scoreNum;
        this.restartButton.visible = true;
        this.gameoverOverlay.visible = true;
        this.finalScoreTxt.visible = true;
    };
    
    p.pauseGame = function(bool) {
        this.gameIsPaused = bool;
    };

    p.speedUp = function() {
        //console.log("speed up");
        var speed = this.intervalSpeed - 200;
        this.restartInterval(speed);
        if(this.intervalSpeed < 1000){
            this.maxSpeedReached = true;
        }
    };

    p.restartInterval = function(newInterval){
        this.stopInterval();
        this.intervalSpeed = newInterval;
        this.startInterval();
    };

    p.startInterval = function() {
        this.movingInterval = setInterval(this.moveSheeps,this.intervalSpeed);
    };
    
    p.stopInterval = function() {
        clearInterval(this.movingInterval);
    };

    p.render = function (e) {
        stage.update(e);
        //console.log(this.numChildren);
    };

    system.Game = createjs.promote(Game,"Container");
})();


