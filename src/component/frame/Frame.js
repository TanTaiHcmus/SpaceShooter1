let FrameComponent = cc.Class.extend({
    ctor: function (screenSize){
        this.sprite = new cc.Sprite(res.base.frame);
        this.sprite._setAnchorY(0)
        this.sprite._setAnchorX(0)
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScale(screenSize.width/contentSize.width, screenSize.height/contentSize.height)
        this.sprite.setPosition(0, 0);
    },
    getSprite: function (){
        return this.sprite
    }
})