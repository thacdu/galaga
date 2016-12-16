/**
 * Created by Du Nguyen Thac on 17/12/2016.
 */

var GreenEnemy = cc.Sprite.extend({
    states : {
        // attack the start point is currentPosition.
        attack: {
            controlPoints: {
                p1: new app.Point(70, -50),
                p2: new app.Point(0, 250),
                p3: new app.Point(140, 350),
                p4: new app.Point(140, 350),
                p5: new app.Point(500, 300),
                p6: new app.Point(100, 250)
            }
        }
    },

    ctor: function (file) {
        this._super(file);
    },

    initData: function () {

    }
});