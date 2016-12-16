var BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winSize = cc.director.getWinSize();

        //create the background image and position it at the center of screen
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        var spriteBG = new cc.Sprite(res.mainBG_png);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);
    }
});
