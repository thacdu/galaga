var AnimationLayer = cc.Layer.extend({
    playerSprite : null,
    isDead: false,
    isFire: false,
    winSize: null,
    timer: 0,
    speed: 300,
    vec: 0,
    mousePos: null,
    cellSize: 40,
    greenStartRow: 3,
    brigadeStartRow: 2,
    brigadeStartColumn: 2,
    brigadePulseTimer: 0,
    brigadePulseDelay: 5000,
    brigadePulseDirection: 'in',
    enemies: null,
    enemySpace: 0,
    shotTimer: 0,
    timeToShot: 0,


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
        this.enemySpace = 15;
        this.shotTimer = 0;
        this.timeToShot = Math.random() * 3 + 1;
        this.addChild(this.playerSprite);

        this.initEnemies();

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

        this.shotTimer += dt;
        if (this.shotTimer > this.timeToShot) {
            this.shotTimer = 0;
            this.timeToShot = Math.random() * 3 + 1;
            var enemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            enemy.onFire();
        }
    },

    initEnemies: function () {
        this.enemies = Array();
        this.initGreenEnemies();
        this.initRedEnemies();
        this.initBlueEnemies();
    },

    initGreenEnemies: function () {
        for (var i = -2; i <= 2; i++) {
            if (i == 0)
                continue;
            var sp = new GreenEnemy(res.greenEnemy_png);
            this.addChild(sp);
            this.enemies.push(sp);
            sp.setScale(scaleFactor);
            var j = i;
            var pad = 1.5;
            if (j < 0) {
                j += 1;
                pad = -1.5;
            } else {
                j -= 1;
            }
            sp.setPosition(cc.p(this.winSize.width / 2 + this.enemySpace * (j * 3 + pad), this.winSize.height * 0.8));
        }
    },

    initBlueEnemies: function() {
        for (var i = -5; i <= 5; i++) {
            if (i == 0)
                continue;
            var sp = new OneHitEnemy(res.blueYellowRedEnemy_png);
            this.addChild(sp);
            this.enemies.push(sp);
            sp.setScale(scaleFactor);
            var j = i;
            var pad = 1.5;
            if (j < 0) {
                j += 1;
                pad = -1.5;
            } else {
                j -= 1;
            }
            sp.setPosition(cc.p(this.winSize.width / 2 + this.enemySpace * (j * 3 + pad), this.winSize.height * 0.7));
        }
    },

    initRedEnemies: function () {
        for (var i = -4; i <= 4; i++) {
            if (i == 0)
                continue;
            var sp = new OneHitEnemy(res.redBluePinkEnemy_png);
            this.addChild(sp);
            this.enemies.push(sp);
            sp.setScale(scaleFactor);
            var j = i;
            var pad = 1.5;
            if (j < 0) {
                j += 1;
                pad = -1.5;
            } else {
                j -= 1;
            }
            sp.setPosition(cc.p(this.winSize.width / 2 + this.enemySpace * (j * 3 + pad), this.winSize.height * 0.75));
        }
    },

    bezier: function () {
        // just for test
        var moveTo = new cc.MoveTo(2, cc.p(20, 20));
        var bezier = [cc.p(20, 100), cc.p(200, 100), cc.p(200, 20)];
        var bezierTo = new cc.BezierTo(2, bezier);
        that.playerSprite.runAction(new cc.Sequence(moveTo, bezierTo));
    },

    getEnemies: function () {
        return this.enemies;
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