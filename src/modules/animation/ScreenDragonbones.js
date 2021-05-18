/**
 * Created by GSN on 7/9/2015.
 */


var ScreenDragonbones = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        this.size = cc.director.getVisibleSize();
        this.size.width -= 200
        this.recSize = this.size.width / REC_AMOUNT;
        this.speed = 500
        this.prevXTile = this.size.width / 2
        this.listBrickInvisibleNext = []
        this.hearts = new Array(3).fill().map((item, index) => new HeartComponent(this.size.width + 45 + (HEART_SIZE + 10) * index))
        for (let i = 0; i < 3; i++){
            this.addChild(this.hearts[i].getSprite())
        }
        this.listBrick = new ListBrickComponent(4, this.size).getList()
        for (let i=0; i < this.listBrick.length; i++) {
            for (let j = 0; j < this.listBrick[i].length; j++) {
                this.addChild(this.listBrick[i][j].getSprite())
            }
        }
        this.tile = new TileComponent(this.size.width / 2)
        this.addChild(this.tile.getSprite())
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, this);
        this.state = {
            prevXBall: this.size.width / 2,
            prevYBall: BALL_SIZE + TILE_SIZE.HEIGHT,
            direction: DIRECTION.UP,
            a: -1
        }
        this.ball = new BallComponent(this.state.prevXBall, this.state.prevYBall)
        this.addChild(this.ball.getSprite())
        this.scheduleUpdate()
    },
    reset: function (){
        for (let i=0; i < this.listBrick.length; i++) {
            for (let j = 0; j < this.listBrick[i].length; j++) {
                this.listBrick[i][j].setVisible(true)
            }
        }
        const xTile = this.tile.getPositionX()
        this.state = {
            prevXBall: xTile,
            prevYBall: BALL_SIZE + TILE_SIZE.HEIGHT,
            tileDirection: 0,
            a: -1,
            direction: DIRECTION.UP
        }
        this.ball.setPosition(this.state.prevXBall, this.state.prevYBall)
    },
    handleMoveBallWhenImpactLine: function (impact){
        this.state.a = - this.state.a;
        this.state.direction = impact.direction
        this.state.prevXBall = impact.x;
        this.state.prevYBall = impact.y;
        this.ball.move(this.state.prevXBall, this.state.prevYBall, impact.distance / this.speed)
    },
    findNextImpact: function(){
        let arr = [];
        for (let i = 0; i < this.listBrick.length; i++)
            for (let j = 0; j < REC_AMOUNT; j++) if (this.listBrick[i][j].getVisible()){
                const {x, y} = this.listBrick[i][j].getPosition();
                let impact = handleGetImpactInfo(this.state, x, y, x + this.recSize, y + this.recSize)
                if (impact.distance){
                    if (arr.length === 0 || impact.distance < arr[0].distance){
                        arr = [impact]
                        this.listBrickInvisibleNext = [{i, j}]
                    }
                    else if (Math.abs(impact.distance - arr[0].distance) <= Precision){
                        arr.push(impact)
                        this.listBrickInvisibleNext.push({i, j})
                    }
                }
            }

        if (arr.length > 0){
            if (arr.length === 1){
                this.state.a = - this.state.a;
                this.state.direction = arr[0].direction
            }
            else{
                this.state.direction = this.state.direction === DIRECTION.UP ? DIRECTION.DOWN : DIRECTION.UP;
            }
            this.state.prevXBall = arr[0].x;
            this.state.prevYBall = arr[0].y;
            this.ball.move(this.state.prevXBall, this.state.prevYBall, arr[0].distance / this.speed)

            return
        }

        let impactLeftLine = handleGetImpactInfo(this.state, 0, -30, 0, this.size.height);
        if (impactLeftLine.distance){
            this.handleMoveBallWhenImpactLine(impactLeftLine)
            return
        }

        let impactRightLine = handleGetImpactInfo(this.state, this.size.width, -30, this.size.width, this.size.height);
        if (impactRightLine.distance){
            this.handleMoveBallWhenImpactLine(impactRightLine)
            return;
        }

        let impactTopLine = handleGetImpactInfo(this.state, 0, this.size.height, this.size.width, this.size.height);
        if (impactTopLine.distance){
            this.handleMoveBallWhenImpactLine(impactTopLine)
            return;
        }

        let impactBottomLine = handleGetImpactInfo(this.state, 0, -30, this.size.width, -30);
        if (impactBottomLine.distance){
            this.handleMoveBallWhenImpactLine(impactBottomLine)
        }
    },
    onTouchBegan: function (touch){
        return true
    },
    onTouchMoved: function (touch) {
        let {x} = touch.getLocation();
        if (x < TILE_SIZE.WIDTH / 2) x = TILE_SIZE.WIDTH / 2
        else if (x + TILE_SIZE.WIDTH / 2 > this.size.width) x = this.size.width - TILE_SIZE.WIDTH / 2;
        if (!this.ball.getIsMove()){
            this.ball.setPosition(x)
            this.state.prevXBall = x;
        }
        this.tile.setPositionX(x)
        return true
    },
    onTouchEnded: function (touch){
        if (this.ball.getIsMove()) cc.log("move")
        if (!this.ball.getIsMove()){
           this.findNextImpact()
        }
        return true
    },
    update: function (dt){
        const {x: xBall, y: yBall} = this.ball.getPosition();
        const xTile = this.tile.getPositionX()

        if (this.ball.getIsMove()){
            if (checkImpactTile(xBall, yBall, xTile) && this.state.prevYBall < 0){
                this.ball.setIsMove(false)
                this.state.prevXBall = xBall
                this.state.prevYBall = yBall
                // if (Math.abs(xTile - this.prevXTile) < 1){
                // }
                // else{
                //     this.state.a = this.state.a / 2
                // }
                this.findNextImpact();

                return;
            }
        }

        if (yBall < 0){
            if (this.hearts.length > 0){
                this.hearts[this.hearts.length - 1].setInvisible();
                this.hearts.length--;
                if (this.hearts.length > 0) this.reset();
            }
            return;
        }
        if (this.ball.getIsMove() && Math.abs(xBall - this.state.prevXBall) <= Precision && Math.abs(yBall - this.state.prevYBall) <= Precision) {
            this.ball.setIsMove(false)
            for (let k = 0; k < this.listBrickInvisibleNext.length; k++){
                const invisibleBrick = this.listBrickInvisibleNext[k];
                this.listBrick[invisibleBrick.i][invisibleBrick.j].setVisible(false)
            }
            this.listBrickInvisibleNext = [];
            this.findNextImpact()
        }
        this.prevXTile = xTile;
    }
});