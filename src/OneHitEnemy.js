
var OneHitEnemy = cc.Sprite.extend({
    isDead: false,
    winSize: null,
    vec: 1,
    isFlying: false,

    ctor: function (file) {
        this._super(file);
        this.init();
    },

    init: function () {
        vec = 1;
        this.isDead = false;
        this.winSize = cc.director.getWinSize();
        this.isFlying = false;
        this.scheduleUpdate();
    },

    update: function (dt) {
        if (this.isFlying)
            return;
        var position = this.getPosition();
        position.x += MOVE_SPEED * vec * dt;
        if (vec < 0) {
            if (position.x < 20) {
                vec = 1;
            }
        } else {
            if (position.x > this.winSize.width - 20) {
                vec = -1;
            }
        }
        this.setPosition(position);
    },

    onFire: function () {
        this.bezier();
        var bullet = new Missile(res.bullet_png);
        bullet.setPosition(cc.p(this.getPositionX(), this.getPositionY()
            + this.getContentSize().height/2 * scaleFactor - 5));
        bullet.setScale(scaleFactor);
        animationLayer.addChild(bullet);
        bullet.initData('enemy', this.winSize.height);
    },

    hitMissile: function () {
        this.destroy();
        statusLayer.removeEnemy();
    },

    destroy: function () {
        this.isDead = true;
        this.unscheduleUpdate();
        this.removeFromParent();
    },

    bezier: function () {
        this.isFlying = true;
        /*
        var bezier = [this.getPosition(), cc.p(this.getPositionX() - 200, this.getPositionY() - 100), cc.p(this.getPositionX(), this.getPositionY() - 200)];
        var bezierTo = new cc.BezierTo(1, bezier);
        //var bezierBack = new cc.BezierTo(1, [cc.p(this.getPositionX(), this.getPositionY() - 200), cc.p(this.getPositionX() + 200, this.getPositionY() - 100), this.getPosition()]);
        //this.runAction(cc.sequence(bezierTo, cc.callFunc(this.halFly(), this)));
        this.runAction(cc.sequence(bezierTo));*/

         var array = [
             cc.p(0, 0),
             cc.p(-100, -100),
             cc.p(0, -200),
             cc.p(100, -100),
             cc.p(0, 0)
         ];

        var action1 = cc.cardinalSplineBy(2.0, array, 0);
        var seq = cc.sequence(action1, cc.callFunc(this.halFly, this));
        this.runAction(seq);
    },

    halFly: function () {
        cc.log("hihi");
        this.isFlying = false;
    },

    finishFly: function() {

    }
});
