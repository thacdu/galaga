/**
 * Created by Du Nguyen Thac on 17/12/2016.
 */

var GreenEnemy = cc.Sprite.extend({
    isDead: false,
    winSize: null,
    vec: 1,
    life: 0,

    ctor: function (file) {
        this._super(file);
        this.init();
    },

    init: function () {
        vec = 1;
        this.isDead = false;
        this.winSize = cc.director.getWinSize();
        this.life = 2;
        this.scheduleUpdate();
    },

    update: function (dt) {
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
        var bullet = new Missile(res.bullet_png);
        bullet.setPosition(cc.p(this.getPositionX(), this.getPositionY()
            + this.getContentSize().height/2 * scaleFactor - 5));
        bullet.setScale(scaleFactor);
        animationLayer.addChild(bullet);
        bullet.initData('enemy', this.winSize.height);
    },

    updateColor: function () {
        switch (this.life) {
            case 1:
                this.setTexture(res.blueEnemy_png);
                break;
        }
    },

    hitMissile: function () {
        this.life--;
        if (this.life == 0) {
            this.destroy();
            statusLayer.removeEnemy();
        } else {
            this.updateColor();
        }
    },

    destroy: function () {
        this.isDead = true;
        this.unscheduleUpdate();
        this.removeFromParent();
    }
});