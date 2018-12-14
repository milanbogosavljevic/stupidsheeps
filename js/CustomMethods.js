this.system = this.system || {};

(function() {
    "use strict";

    var CustomMethods = function() {};

    CustomMethods.makeText = function (txt,font,color,align,baseline) {
        var textField = new createjs.Text(txt, font, color);
        textField.textAlign = align;
        textField.textBaseline = baseline;
        textField.mouseEnabled = false;
        textField.tickEnabled = false;
        return textField;
    };

    CustomMethods.makeImage = function (id , clickable) {
        var img = new createjs.Bitmap(queue.getResult(id));
        img.mouseEnabled = clickable;
        img.tickEnabled = false;
        return img;
    };

    CustomMethods.playSound = function (id , vol , loop) {
        loop = loop || 0;
        vol = vol || 1;
        createjs.Sound.play(id, {loop:loop, volume:vol});
    };
    
    CustomMethods.getLastChar = function (str) {
        return str.charAt(str.length - 1);
    };

    CustomMethods.makeAnimation = function (img,framesNum,fps,loop) {
        var sheet = queue.getResult(img);
        var singleWidth = sheet.width/framesNum;
        var singleHeight = sheet.height;
        var frames = framesNum - 1;
        var data = {
            images: [sheet],
            frames: {regX:singleWidth/2 , regY:singleHeight/2 ,width: singleWidth, height: singleHeight, count:framesNum},
            animations: {
                animate: [0, frames , loop]
            },
            framerate:fps
        };
        var bmpAnimation = new createjs.SpriteSheet(data);
        var animation = new createjs.Sprite(bmpAnimation);
        animation.mouseEnabled = false;
        return animation;
    };

    CustomMethods.getRandomNumberFromTo = function (from , to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

    CustomMethods.getRandomBool = function () {
        return Math.random() > 0.5;
    };

    system.CustomMethods = CustomMethods;
})();