/**
 * Created by Du Nguyen Thac on 16/12/2016.
 */

var Missile = cc.Sprite.extend({
    vec: 0,

    ctor: function (file) {
        this._super(file);
    },
    
    initData: function (owner, maxY) {
        this.owner = owner;
        this.maxY = maxY;
        if (this.owner === 'player') {
            this.vec = 1;
        } else {
            this.vec = -1;
        }
        this.scheduleUpdate();
    },

    update: function (dt) {
        var posY = this.getPositionY() + MISSILE_SPEED * this.vec * dt;
        this.setPositionY(posY);
        if (posY < 0 || posY > this.maxY) {
            this.unscheduleUpdate();
            this.runAction(new cc.RemoveSelf());
        } else {
            if (this.owner === 'player') {
                var enemies = enemyLayer.enemies;
                for (var i = 0; i < enemies.length; i++) {
                    var enemy = enemies[i];
                    if (enemy.state === STATE_DEAD)
                        continue;
                    var bb = enemy.getBoundingBox();
                    var p = enemyLayer.convertToWorldSpace(cc.p(bb.x, bb.y));
                    bb.x = p.x;
                    bb.y = p.y;
                    if (cc.rectIntersectsRect(bb, this.getBoundingBox())) {
                        this.destroy();
                        enemy.hitMissile();
                    }
                }
            } else {
                var player = animationLayer.getPlayer();
                if (cc.rectIntersectsRect(player.getBoundingBox(), this.getBoundingBox())) {
                    this.destroy();
                    animationLayer.loseLife();
                }
            }
        }
    },

    destroy: function () {
        this.unscheduleUpdate();
        this.removeFromParent();
    }
});
