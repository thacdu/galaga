/**
 * Created by Du Nguyen Thac on 16/12/2016.
 */

var Missile = cc.Sprite.extend({
    vec: 0,
    maxY: 0,

    ctor: function (file) {
        this._super(file);
    },
    
    initData: function (owner, maxY) {
        this.owner = owner;
        this.maxY = maxY;
        if (owner === 'player') {
            vec = 1;
        } else {
            vec = -1;
        }
        this.scheduleUpdate();
    },

    update: function (dt) {
        var posY = this.getPositionY() + MISSILE_SPEED * vec * dt;
        this.setPositionY(posY);
        if (posY < 0 || posY > this.maxY) {
            cc.log(this._position);
            cc.log(this.maxY);
            this.unscheduleUpdate();
            this.runAction(new cc.RemoveSelf());
        }
    }
});
