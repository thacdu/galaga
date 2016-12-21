
var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        animationLayer = new AnimationLayer();
        statusLayer = new StatusLayer();
        //add three layer in the right order
        this.addChild(new BackgroundLayer());
        this.addChild(animationLayer);
        this.addChild(statusLayer);
    }
});