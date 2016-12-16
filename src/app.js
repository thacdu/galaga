

var MenuLayer = cc.Layer.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //2. get the screen size of your game canvas
        var winSize = cc.director.getWinSize();

        //3. calculate the center point
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);

        //4. create a background image and set it's position at the center of the screen
        var spriteBg = new cc.Sprite(res.mainBG_png);
        spriteBg.setPosition(centerPos);
        this.addChild(spriteBg);

        var spriteLogo = new cc.Sprite(res.logo_png);
        spriteLogo.setPosition(cc.p(winSize.width / 2, winSize.height - 150));
        this.addChild(spriteLogo);

        //5.
        cc.MenuItemFont.setFontSize(60);

        //6.create a menu and assign onPlay event callback to it
        var menuItemPlay = new cc.MenuItemSprite(
        	new cc.Sprite(res.btnStart_n_png), // normal state image
        	new cc.Sprite(res.btnStart_s_png), //select state image
            this.onPlay, this);
        var menu = new cc.Menu(menuItemPlay);  //7. create the menu
        menu.setPosition(centerPos);
        this.addChild(menu);
    },

    onPlay : function(){
        cc.director.runScene(new PlayScene());
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});
