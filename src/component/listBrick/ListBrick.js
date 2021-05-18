var ListBrickComponent = cc.Class.extend({
    enum: [COLOR_RECTANGLE_OPTIONS.RED, COLOR_RECTANGLE_OPTIONS.YELLOW, COLOR_RECTANGLE_OPTIONS.GREEN, COLOR_RECTANGLE_OPTIONS.BLUE],
    ctor: function (rows, screenSize){
        this.rows = rows;
        const recSize = (screenSize.width) / REC_AMOUNT
        this.list = new Array(rows).fill().map((item, index) => {
            const yPosition = screenSize.height - (index + 1) * recSize
            return new Array(REC_AMOUNT).fill().map((item1, index1) => {
                return new BrickComponent(index1*recSize, yPosition, this.enum[index % this.enum.length],recSize)
            })
        })
    },
    getList: function (){
        return this.list
    }
})