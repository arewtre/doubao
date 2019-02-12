let App = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    winHeight: 0,
    winWidth: 0,
    pid: "",
    searchKeyWords: '',
    placeholderWords: '请输入搜索关键词...',
    items:{},
    kjsearchList:{}
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    })
  },
  clearInput: function () {
    this.setData({
      inuptVal: ""
    })
  },
  getXcByCate: function (e) {
    let that = this;
    //console.log(e.currentTarget.dataset.id);
    getXc(that, e.currentTarget.dataset.id);
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  collectApi: function (e) {
    console.log("此处进行收藏！");
  },
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.albumid);
    //进入创作页面
    // wx.navigateTo({
    //   url: '?albumId='+e.currentTarget.dataset.albumid
    // })
  },
  onLoad: function (options) {
    let that = this;
    getXc(that, that.data.pid);
    requestGetCate(that);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      }
    })
    
    this.search('');
  },
  searchKeyWords: function (e) {
    console.log("搜索开始了了！");
    let that = this;
    if (that.data.searchKeyWords == that.data.placeholderWords) {
      return;
    }
    that.search(that.data.searchKeyWords);
  },
  searchKeyWordsFast: function (e) {
    this.search(e.currentTarget.dataset.keyword);
  },
  search(queryWords) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    console.log("当前搜索关键词：" + queryWords);
    let _this = this;
    App._get('getXc', { keyword: queryWords }, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          items: result.data
        });

      } else {
        App.showError(result.msg);
      }
      wx.hideToast();
    });
    
  },
  getKeywords: function (e) {
    // this.setData({
    //   searchKeyWords:e.detail.value
    // })
    this.search(e.detail.value);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {
    return {
      title: '豆宝网',
      desc: '豆宝相册,快来围观!',
      path: 'pages/flow/index'
    }
  }
})
function getXc(that, pid) {
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  });
  App._get('getXc', { pid: pid}, function (result) {
    console.log(result);
    if (result.code === 1) {
      that.setData({
        items: result.data,
        pid: pid
      });

    } else {
      App.showError(result.msg);
    }
    wx.hideToast();
  });
}
function requestGetCate(that) {
  App._get('getXcCate', {}, function (result) {
    console.log(result);
    if (result.code === 1) {
      that.setData({
        kjsearchList: result.data
      });

    } else {
      App.showError(result.msg);
    }
    wx.hideToast();
  });
}
function randomChar() {
  var l = Math.random() * 10;
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < l; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return timestamp + tmp;
}