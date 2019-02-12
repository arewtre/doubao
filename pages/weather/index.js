let App = getApp();
Page({
  data: {
    // text:"这是一个页面"
    city: "",
    today: {},
    future: {}
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
    // 页面初始化 options为页面跳转所带来的参数
    this.loadInfo();
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
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude, longitude);
        page.loadCity(latitude, longitude);
      }
    })
  },
  loadCity: function (latitude, longitude) {
    var page = this;
    App._get('getCity', { latitude: latitude, longitude: longitude }, function (res) {
      console.log(res);
      if (res.code === 1) {
        var city = res.data.result.addressComponent.city;
        city = city.replace("市", "");
        page.setData({ city: city });
        page.loadWeather(city);

      } else {
        App.showError(res.data.msg);
      }
      // 隐藏加载框
      wx.hideLoading();
    });
    
  },
  loadWeather: function (city) {
    var page = this;
    App._get('getWeather', { city: city }, function (result) {
      
      var res = result.data;
      console.log(res.data.forecast);
      if (result.code === 1) {
        var future = res.data.forecast;
        var todayInfo = future.shift();
        var today = res.data;
        today.todayInfo = todayInfo;
        page.setData({ today: today, future: future })

      } else {
        App.showError(result.msg);
      }
      // 隐藏加载框
      wx.hideLoading();
    });
    
  }
})