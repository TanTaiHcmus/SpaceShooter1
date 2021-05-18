let TileComponent = cc.Class.extend({
    ctor: function(x){
        this.sprite = new cc.Sprite(res.base.tile);
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScale(TILE_SIZE.WIDTH/contentSize.width, TILE_SIZE.HEIGHT/contentSize.height)
        this.sprite._setAnchorY(0)
        this.sprite.setPosition(x,0)
    },
    getSprite: function (){
        return this.sprite
    },
    setPositionX: function (x){
        this.sprite.setPositionX(x)
    },
    getPositionX: function (){
        return this.sprite.getPosition().x;
    }
})