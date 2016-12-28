var StatusLayer = cc.Layer.extend({
    labelTextScore : null,
    labelScore : null,
    labelTextHighScore : null,
    labelHighScore : null,
    labelGameOver: null,
    score : 0,
    hightScore : 0,
    life : 3,
    lifeSprite: null,
    numberEnemies: 0,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();

        var winSize = cc.director.getWinSize();

        this.labelTextScore = new cc.LabelTTF("SCORE", "Helvetica", 20);
        this.labelTextScore.setPosition(cc.p(50, winSize.height - 20));
        this.labelTextScore.setColor(cc.color.RED);
        this.addChild(this.labelTextScore);

        this.labelScore = new cc.LabelTTF("0", "Helvetica", 20);
        this.labelScore.setPosition(cc.p(this.labelTextScore.getPositionX(), this.labelTextScore.getPositionY() - 20));
        this.addChild(this.labelScore);

        this.labelTextHighScore = new cc.LabelTTF("HIGH SCORE", "Helvetica", 20);
        this.labelTextHighScore.setPosition(cc.p(winSize.width/2, this.labelTextScore.getPositionY()));
        this.labelTextHighScore.setColor(cc.color.RED);
        this.addChild(this.labelTextHighScore);

        this.labelHighScore = new cc.LabelTTF("0", "Helvetica", 20);
        this.labelHighScore.setPosition(cc.p(winSize.width/2, this.labelScore.getPositionY()));
        this.addChild(this.labelHighScore);

        this.labelGameOver = new cc.LabelTTF("GAME OVER", "Helvetica", 50);
        this.addChild(this.labelGameOver);
        this.labelGameOver.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.labelGameOver.setColor(cc.color.WHITE);
        this.labelGameOver.setVisible(false);

        this.lifeSprite = Array();
        for (var i = 1; i < this.life; i++) {
            var sprt = new cc.Sprite(res.player_png);
            sprt.setScale(scaleFactor);
            if (i == 1) {
                sprt.setPosition(30, 30);
            } else {
                sprt.setPosition(40 * i, 30);
            }
            this.addChild(sprt);
            this.lifeSprite.push(sprt);
        }

        this.numberEnemies = enemyLayer.enemies.length;
    },

    lossLife: function () {
        this.life--;
        this.lifeSprite[this.life-1].setVisible(false);
    },

    showGameOver: function () {
        this.labelGameOver.setVisible(true);
    },

    removeEnemy: function () {
        this.numberEnemies--;
        if (this.numberEnemies == 0) {
            this.showGameOver();
        }
    }
});
