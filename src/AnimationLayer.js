var AnimationLayer = cc.Layer.extend({
    playerSprite : null,
    isDead: false,
    isFire: false,
    winSize: null,
    timer: 0,
    speed: 300,
    vec: 0,
    mousePos: null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        this.winSize = cc.director.getWinSize();
        this.playerSprite = new cc.Sprite(res.player_png);
        this.playerSprite.setPosition(cc.p(this.winSize.width / 2, 100));
        this.playerSprite.setScale(scaleFactor);
        this.addChild(this.playerSprite);

        enemyLayer = new EnemyLayer();
        this.addChild(enemyLayer);

        var that = this;
        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    switch (key) {
                        case cc.KEY.left:
                            that.onMoveLeft();
                            break;
                        case cc.KEY.right:
                            that.onMoveRight();
                            break;
                        default:
                            break;
                    }
                }
            }, this);
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                that.timer = 0;
                that.isFire = true;
                that.onFire();
                return true;
            },

            onTouchEnded: function (touch, event) {
                that.isFire = false;
            }
        }, this);

        this.mousePos = this.playerSprite.getPosition();

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function (event) {
                if (this.isDead)
                    return;
                that.mousePos = event.getLocation();
                if (that.playerSprite.getPositionX() < that.mousePos.x) {
                    that.vec = 1;
                } else {
                    that.vec = -1;
                }
            }
        }, this);

        this.scheduleUpdate();
    },

    onMoveLeft: function () {
        this.vec = -1;
    },

    onMoveRight: function () {
        this.vec = 1;
    },
    
    onFire: function () {
        var bullet = new Missile(res.bullet_png);
        bullet.setPosition(cc.p(this.playerSprite.getPositionX(), this.playerSprite.getPositionY()
            + this.playerSprite.getContentSize().height/2 * scaleFactor + 5));
        bullet.setScale(scaleFactor);
        this.addChild(bullet);
        bullet.initData('player', this.winSize.height);
    },

    update: function (dt) {
        if (this.isDead == true)
            return;
        var position = this.playerSprite.getPosition();
        position.x += this.speed * this.vec * dt;
        if (this.vec < 0) {
            if (position.x < this.mousePos.x)
                position.x = this.mousePos.x;
            if (position.x < 0) {
                position.x = 0
            }
        } else {
            if (position.x > this.mousePos.x)
                position.x = this.mousePos.x;
            if (position.x > this.winSize.width) {
                position.x = this.winSize.width;
            }
        }
        this.playerSprite.setPosition(position);
        if (this.isFire) {
            this.timer += dt;
            if (this.timer >= 0.3) {
                this.timer = 0;
                this.onFire();
            }
        }
    },

    getPlayer: function () {
        return this.playerSprite;
    },
    
    loseLife: function () {
        this.isDead = true;
        this.vec = 0;
        if (statusLayer.life == 1) {
            statusLayer.showGameOver();
        } else {
            statusLayer.lossLife();
            this.playerSprite.setPositionX(this.winSize.width/2);
            this.isDead = false;
        }
    }
});