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
        this.speed = 700
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
        this.prevXTile = xTile
        this.ball.setPosition(this.state.prevXBall, this.state.prevYBall)
    },
    handleMoveBallWhenImpactLine: function (impact, isBottom){
        if (!isBottom) {
            this.state.a = - this.state.a;
            this.state.direction = impact.direction
        }
        this.state.prevXBall = impact.x;
        this.state.prevYBall = impact.y;
        this.ball.move(this.state.prevXBall, this.state.prevYBall, impact.distance / this.speed)
    },
    findNextImpact: function(){
        let arr = [];
        for (let i = 0; i < this.listBrick.length; i++)
            for (let j = 0; j < REC_AMOUNT; j++) if (this.listBrick[i][j].getVisible()){
                const {x, y} = this.listBrick[i][j].getPosition();
                let impact = handleGetImpactInfo(this.state, x, y, x + this.recSize, y + this.recSize, this.size)
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

        let impactLeftLine = handleGetImpactInfo(this.state, 0, TILE_SIZE.HEIGHT + DISTANCE_CHECK_IMPACT_TILE, 0, this.size.height, this.size);
        if (impactLeftLine.distance){
            this.handleMoveBallWhenImpactLine(impactLeftLine)
            return
        }

        let impactRightLine = handleGetImpactInfo(this.state, this.size.width, TILE_SIZE.HEIGHT + DISTANCE_CHECK_IMPACT_TILE, this.size.width, this.size.height, this.size);
        if (impactRightLine.distance){
            this.handleMoveBallWhenImpactLine(impactRightLine)
            return;
        }

        let impactTopLine = handleGetImpactInfo(this.state, 0, this.size.height, this.size.width, this.size.height, this.size);
        if (impactTopLine.distance){
            this.handleMoveBallWhenImpactLine(impactTopLine)
            return;
        }

        let impactBottomLine = handleGetImpactInfo(this.state, 0, TILE_SIZE.HEIGHT + DISTANCE_CHECK_IMPACT_TILE, this.size.width, TILE_SIZE.HEIGHT + DISTANCE_CHECK_IMPACT_TILE, this.size);
        if (impactBottomLine.distance){
            this.handleMoveBallWhenImpactLine(impactBottomLine, true)
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
        if (!this.ball.getIsMove()){
           this.findNextImpact()
        }
        return true
    },
    update: function (dt){
        const {x: xBall, y: yBall} = this.ball.getPosition();
        const xTile = this.tile.getPositionX()
        const distanceTile = xTile - this.prevXTile
        this.prevXTile = xTile;

        if (this.ball.getIsMove() && Math.abs(xBall - this.state.prevXBall) <= Precision && Math.abs(yBall - this.state.prevYBall) <= Precision) {
            if (this.state.prevYBall === TILE_SIZE.HEIGHT + BALL_SIZE + DISTANCE_CHECK_IMPACT_TILE){
                const impactTile = handleGetImpactInfo(this.state, xTile - TILE_SIZE.WIDTH / 2, 0, xTile + TILE_SIZE.WIDTH / 2, TILE_SIZE.HEIGHT, this.size)

                if (impactTile.distance && impactTile.direction === DIRECTION.UP) {
                    this.state.direction = impactTile.direction
                    if (Math.abs(distanceTile) > 1) {
                        this.state.a = (impactTile.y - yBall) / (impactTile.x - xBall - distanceTile * impactTile.distance / this.speed * 60)
                    }
                    else {
                        this.state.a = - this.state.a;
                    }

                    this.state.prevXBall = impactTile.x
                    this.state.prevYBall = impactTile.y
                    this.ball.move(impactTile.x, impactTile.y, impactTile.distance / this.speed)
                }
                else{
                    const b = yBall - this.state.a * xBall
                    this.state.prevXBall = (-BALL_SIZE - b) / this.state.a;
                    this.state.prevYBall = -BALL_SIZE;
                    const distance = getDistance(this.state.prevXBall, xBall, this.state.prevYBall, yBall)
                    this.ball.move(this.state.prevXBall, this.state.prevYBall, distance / this.speed )

                    setTimeout(() => {
                        if (this.hearts.length > 0){
                            this.hearts[this.hearts.length - 1].setInvisible();
                            this.hearts.length--;
                            if (this.hearts.length > 0) this.reset();
                        }
                    }, distance / this.speed * 1000)

                }
                return;
            }
            for (let k = 0; k < this.listBrickInvisibleNext.length; k++){
                const invisibleBrick = this.listBrickInvisibleNext[k];
                this.listBrick[invisibleBrick.i][invisibleBrick.j].setVisible(false)
            }
            this.listBrickInvisibleNext = [];
            this.findNextImpact()
        }
    }
});