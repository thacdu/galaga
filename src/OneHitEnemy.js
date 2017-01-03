
var OneHitEnemy = cc.Sprite.extend({
    winSize: null,
    state: null,
    pos: null,
    shotTimer: 0,
    timeToShot: 0,

    ctor: function (file) {
        this._super(file);
        this.init();
    },

    init: function () {
        this.isDead = false;
        this.winSize = cc.director.getWinSize();
        this.state = STATE_NORMAL;
        this.scheduleUpdate();
    },

    update: function (dt) {
        var p = enemyLayer.convertToWorldSpace(this.pos);

        if (enemyLayer.vec < 0) {
            if (p.x < 20) {
                enemyLayer.vec = 1;
            }
        } else {
            if (p.x > this.winSize.width - 20) {
                enemyLayer.vec = -1;
            }
        }

        if (this.state === STATE_FLYING) {
            this.shotTimer += dt;
            if (this.shotTimer >= this.timeToShot) {
                this.shotTimer = 0;
                this.timeToShot = Math.random()/2 + 0.5;
                this.onFire();
            }
        }
    },

    onFire: function () {
        var bullet = new Missile(res.bullet_png);
        var p = enemyLayer.convertToWorldSpace(this.getPosition());
        bullet.setPosition(cc.p(p.x, p.y + this.getContentSize().height/2 * scaleFactor - 5));
        bullet.setScale(scaleFactor);
        animationLayer.addChild(bullet);
        bullet.initData('enemy', this.winSize.height);
    },

    hitMissile: function () {
        this.destroy();
        statusLayer.removeEnemy();
    },

    destroy: function () {
        this.state = STATE_DEAD;
        this.stopAllActions();
        this.unscheduleUpdate();
        this.removeFromParent();
    },

    fireFly: function () {
        this.shotTimer = 0;
        this.timeToShot = Math.random()/2 + 0.5;
        this.state = STATE_FLYING;

         var array = [
             cc.p(0, 0),
             cc.p(-60, -100),
             cc.p(-30, -200),
             cc.p(30, -200),
             cc.p(60, -100),
             cc.p(0, 0)
         ];

        var action1 = cc.cardinalSplineBy(2.0, array, 0);
        var seq = cc.sequence(action1, cc.callFunc(this.finishFly, this));
        this.runAction(seq);
    },

    finishFly: function() {
        if (this.state !== STATE_DEAD)
            this.state = STATE_NORMAL;
    }
});
