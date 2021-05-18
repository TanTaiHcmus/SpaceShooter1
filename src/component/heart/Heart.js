let HeartComponent = cc.Class.extend({
    ctor: function (x){
        this.sprite = new cc.Sprite(res.base.heart);
        this.sprite._setAnchorY(0)
        this.sprite._setAnchorX(0)
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScale(HEART_SIZE/contentSize.width, HEART_SIZE/contentSize.height)
        this.sprite.setPosition(x, 10);
    },
    getSprite: function (){
        return this.sprite
    },
    setInvisible: function (){
        this.sprite.setVisible(false)
    }
})