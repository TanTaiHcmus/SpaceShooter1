/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();
        var btnStart = gv.commonButton(200, 64, size.width / 2, size.height/ 2 + 50,"Start");
        this.addChild(btnStart);
        btnStart.addClickEventListener(this.onSelectStart);
        var btnExit = gv.commonButton(200, 64, size.width/2, size.height/2 - 50, "Exit")
        this.addChild(btnExit)
       btnExit.addClickEventListener(this.onSelectExit)
    },

    onSelectStart: () => {
        fr.view(ScreenDragonbones)
    },

    onSelectExit: () => {
    },

    onEnter:function(){
        this._super();
    },
    onSelectNetwork:function(sender)
    {
        fr.view(ScreenNetwork);
    },
    onSelectLocalization:function(sender)
    {
        fr.view(ScreenLocalization);
    },
});