let BallComponent = cc.Class.extend({
    ctor: function (x, y){
        this.isMove = false;
        this.actionTag = 0;
        this.sprite = new cc.Sprite(res.base.ball);
        this.sprite.setPosition(x, y)
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScale(BALL_SIZE * 2/contentSize.width, BALL_SIZE * 2/contentSize.height)
    },
    getSprite: function(){
        return this.sprite
    },
    setPosition: function (x,y){
        if (x) this.sprite.setPositionX(x)
        if (y) this.sprite.setPositionY(y)
        this.isMove = false;
        if (this.actionTag > 0) {
            const prevAction = this.sprite.getActionByTag(this.actionTag)
            this.sprite.stopAction(prevAction)
        }
    },
    setIsMove: function (value){
        this.isMove = value
    },
    move: function (x,y, duration){
        if (this.actionTag > 0) {
            const prevAction = this.sprite.getActionByTag(this.actionTag)
            this.sprite.stopAction(prevAction)
        }
        this.setIsMove(true)
        let action = cc.moveTo(duration, x, y)
        this.actionTag++;
        action.setTag(this.actionTag)
        this.sprite.runAction(action)
    },
    getIsMove: function (){
        return this.isMove
    },
    getPosition: function(){
        return this.sprite.getPosition()
    },
})
