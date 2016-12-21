/**
 * Created by Du Nguyen Thac on 17/12/2016.
 */

var GreenEnemy = cc.Sprite.extend({
    isDead: false,
    shotTimer: 0,
    timeToShot: 0,
    winSize: null,
    vec: 1,

    ctor: function (file) {
        this._super(file);
        this.init();
    },

    init: function () {
        vec = 1;
        this.isDead = false;
        this.shotTimer = 0;
        this.timeToShot = Math.random() % 8 + 2;
        this.winSize = cc.director.getWinSize();
        this.scheduleUpdate();
    },

    update: function (dt) {
        this.shotTimer += dt;

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

        if (this.shotTimer > this.timeToShot) {
            this.shotTimer = 0;
            this.timeToShot = Math.random() % 8 + 2;
            this.onFire();
        }
    },

    onFire: function () {
        var bullet = new Missile(res.bullet_png);
        bullet.setPosition(cc.p(this.getPositionX(), this.getPositionY()
            + this.getContentSize().height/2 * scaleFactor - 5));
        bullet.setScale(scaleFactor);
        animationLayer.addChild(bullet);
        bullet.initData('enemy', this.winSize.height);
    },

    destroy: function () {
        this.isDead = true;
        this.unscheduleUpdate();
        this.removeFromParent();
    }
});