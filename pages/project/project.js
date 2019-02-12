// pages/project/project.js
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swipter_height: '550px',
    swiperCurrent: 1,
    list: [],
    beforeColor: "#dcdae3",//指示点颜色
    afterColor: "#a5a2af",//当前选中的指示点颜色
    previousmargin: '30px',//前边距
    nextmargin: '30px',//后边距
    // preIndex: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swipter_height: res.windowHeight
        })
      }
    });
    that.getData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '锲而舍之,朽木不折;锲而不舍,金石可镂',
      imageUrl: '/assets/images/share.jpg'
    }
  },
  swiperChange: function (e) {

    // this.setData({
    //   swiperCurrent: e.detail.current //获取当前轮播图片的下标
    // })
    if (e.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.swiperCurrent == 0 && this.data.preIndex > 1) {//卡死时，重置swiperCurrent为正确索引
        this.setData({ swiperCurrent: this.data.preIndex });
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ swiperCurrent: e.detail.current });
      }
    }

  },
  //跳转链接
  towhere: function (t) {
    console.log(t);
    App.globalData.community_id_for_switch_tab = t.currentTarget.dataset.url;
    wx.switchTab({
      url: App.globalData.community_id_for_switch_tab
    });
  },
  //滑动图片切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  getData: function () {
    let _this = this;
    App._get('getZhuanti', {}, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          list: result.data
        });
      } else {
        App.showError(result.msg);
      }
    });
  }
})
