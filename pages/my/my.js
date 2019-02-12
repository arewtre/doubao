let App = getApp();
Page({
    data: {
      my: [],
      user_id: wx.getStorageSync('user_id'),    
    },
    onLoad: function(option) {
      let _this = this;
      _this.getMyInfo();
      _this.openPublish();
    },
    onShow: function(options) {
      let _this = this;
      _this.getMyInfo();
    },
    onLaunch: function(options) {
    },
    getMyInfo:function(){
      let _this = this;
      App._get('getMyInfo', {}, function (result) {
        console.log(result.data);
        if (result.code === 1) {
          _this.setData({
            my: result.code
          });
        } else {
          App.showError(result.msg);
        }
        wx.hideToast();
      });
    },
  openPublish: function () {
    let _this = this;
    App._get('openPublish', {}, function (result) {
      console.log(result.data);
      if (result.code === 1) {
        _this.setData({
          isopen: result.data.isopen
        });
      } else {
        App.showError(result.msg);
      }
      wx.hideToast();
    });
  }
});