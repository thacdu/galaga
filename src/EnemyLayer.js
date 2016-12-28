
var EnemyLayer = cc.Layer.extend({
    enemies: null,
    enemySpace: 0,
    shotTimer: 0,
    timeToShot: 0,
    vec: 0,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this.vec = 1;
        this.enemySpace = 15;
        this.shotTimer = 0;
        this.timeToShot = Math.random() * 3 + 1;
        this.initEnemies();
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.shotTimer += dt;
        if (this.shotTimer > this.timeToShot) {
            this.shotTimer = 0;
            this.timeToShot = Math.random() * 3 + 1;
            this.randomEnemyFire();
        }

        var pos = this.getPosition();
        pos.x += MOVE_SPEED * this.vec * dt;
        this.setPosition(pos);
    },

    randomEnemyFire: function () {
        if (statusLayer.numberEnemies <= 0)
            return;
        while (true) {
            var enemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            if (enemy.state !== STATE_NORMAL)
                continue;
            enemy.onFire();
            return;
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
            sp.pos = cc.p(cc.winSize.width / 2 + this.enemySpace * (j * 3 + pad), cc.winSize.height * 0.8);
            sp.setPosition(sp.pos);
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
            sp.pos = cc.p(cc.winSize.width / 2 + this.enemySpace * (j * 3 + pad), cc.winSize.height * 0.7);
            sp.setPosition(sp.pos);
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
            sp.pos = cc.p(cc.winSize.width / 2 + this.enemySpace * (j * 3 + pad), cc.winSize.height * 0.75);
            sp.setPosition(sp.pos);
        }
    }
});
