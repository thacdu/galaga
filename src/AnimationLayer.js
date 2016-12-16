var AnimationLayer = cc.Layer.extend({
    playerSprite : null,
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
        var bullet = new cc.Sprite(res.bullet_png);
        this.addChild(bullet);
        bullet.setPosition(cc.p(this.playerSprite.getPositionX(), this.playerSprite.getPositionY()
            + this.playerSprite.getContentSize().height/2 * scaleFactor + 5));
        bullet.setScale(scaleFactor);
        var move = new cc.MoveTo(3, cc.p(bullet.getPositionX(), this.winSize.height + 20));
        bullet.runAction(new cc.Sequence(move, new cc.RemoveSelf()));
    },

    update: function (dt) {
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

    createEnemies: function () {
        var startingX = 0;
        var startingY = 0;
        var enemy;
        var g1Location = 0;
        var g2Location = 0;
        var g3Location = 0;
        var g4Location = 0;
        var g5Location = 0;
        var g6Location = 0;

        this.enemies = Array();
        for (var t = 6; t <= 9; t++) {
            // Green starts in column 6 and is only one row.
            startingX = t * this.cellSize;
            startingY = this.greenStartRow * this.cellSize;
            enemy = new app.GreenEnemy(new app.Point(startingX, startingY));
            enemy.setRow(3);
            enemy.setColumn(t);
            // All GreenEnemies are in Group 3, they need to be added to the array in all even locations.
            enemy.group = 3;
            this.group[3][g3Location] = enemy;
            this.enemies.push(enemy);
            g3Location += 2;
        }

        g3Location = 1;  // For red enemies in group 2 they go in the odd slots.
        for (var row = 4; row <= 5; row++) {
            // Red Blue starts in column 2 and are located in rows 2 and 3.
            for (var j = 4; j <= 11; j++) {
                startingX = j * this.cellSize;
                startingY = row * this.cellSize;
                enemy = new app.Enemy(new app.Point(startingX, startingY), 'redblue');
                enemy.setRow(row);
                enemy.setColumn(j);
                if (j === 6 || j === 9) {
                    enemy.group = 3;
                    this.group[3][g3Location] = enemy;
                    g3Location += 2;
                }
                else if (j === 7 || j === 8) {
                    enemy.group = 1;
                    this.group[1][g1Location] = enemy;
                    g1Location += 1;
                }
                else if (j === 4 || j === 5 || j === 10 || j === 11) {
                    enemy.group = 4;
                    this.group[4][g4Location] = enemy;
                    g4Location += 1;
                }
                this.enemies.push(enemy);
            }
        }

        for (var k = 6; k <= 7; k++) {
            // Blue Yellow starts in column 1 and are located in rows 4 and 5.

            for (var n = 3; n <= 12; n++) {
                startingX = n * this.cellSize;
                startingY = k * this.cellSize;
                enemy = new app.Enemy(new app.Point(startingX, startingY), 'blueyellow');
                enemy.setRow(k);
                enemy.setColumn(n);
                if (n === 7 || n === 8) {
                    enemy.group = 2;
                    this.group[2][g2Location] = enemy;
                    g2Location += 1;
                }
                else if (n === 5 || n === 6 || n === 9 || n === 10) {
                    enemy.group = 5;
                    this.group[5][g5Location] = enemy;
                    g5Location += 1;
                }
                else if (n === 3 || n === 4 || n == 11 || n === 12) {
                    enemy.group = 6;
                    this.group[6][g6Location] = enemy;
                    g6Location += 1;
                }
                this.enemies.push(enemy);
            }
        }
    }
});