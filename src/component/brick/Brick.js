var BrickComponent = cc.Class.extend({
    ctor: function (x, y, color, size){
        this.sprite = new cc.Sprite(this.getImageFromColor(color));
        this.sprite._setAnchorY(0)
        this.sprite._setAnchorX(0)
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScale(size/contentSize.width, size/contentSize.height)
        this.sprite.setPosition(x, y);
    },
    getImageFromColor: (color) => {
        switch (color){
            case COLOR_RECTANGLE_OPTIONS.RED: {
                return res.base.rec_red
            }
            case COLOR_RECTANGLE_OPTIONS.BLUE: {
                return res.base.rec_blue
            }
            case COLOR_RECTANGLE_OPTIONS.GREEN: {
                return res.base.rec_green
            }
            case COLOR_RECTANGLE_OPTIONS.YELLOW: {
                return res.base.rec_yellow
            }
            default: {
                return null
            }
        }
    },
    setVisible:function(value){
        this.sprite.setVisible(value);
    },
    getSprite: function (){
        return this.sprite
    },
    getPosition: function (){
        return this.sprite.getPosition();
    },
    getVisible: function (){
        return this.sprite.isVisible()
    }
})