
App({

  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
    userInfo:null
  },

  api_root: '', // api地址
  siteInfo: require('siteinfo.js'),
  onLoad: function (options) {
    //console.log(options);
    that = this;
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function (res) {
          console.log('用户信息', res.userInfo)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast();
  },
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function () {
    // 设置api地址
    this.setApiRoot();
    wx.getUserInfo({
      success: function (res) {
        //console.log(res);
        wx.setStorageSync("userInfo", res.userInfo);
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // 获取小程序基础信息
    // this.getWxappBase(function (wxapp) {
    //   // 设置navbar标题、颜色
    //   wx.setNavigationBarColor({
    //     frontColor: wxapp.navbar.top_text_color.text,
    //     backgroundColor: wxapp.navbar.top_background_color
    //   })
    // });
  },

  /**
   * 设置api地址
   */
  setApiRoot: function () {
    this.api_root = this.siteInfo.siteroot;
  },

  /**
   * 获取小程序基础信息
   */
  getWxappBase: function (callback) {
    let App = this;
    App._get('getConfig', {}, function (result) {
      //console.log(result);
      if (result.code === 1) {
        // 记录小程序基础信息
        wx.setStorageSync('getConfig', result);
        callback && callback(result);
      } else {
        App.showError("网络出错");
      }
    }, false, false);
  },

  /**
   * 执行用户登录
   */
  doLogin: function () {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },

  /**
   * 当前用户id
   */
  getUserId: function () {
    return wx.getStorageSync('user_id');
  },

  /**
   * 显示成功提示框
   */
  showSuccess: function (msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      success: function () {
        callback && (setTimeout(function () {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
  showError: function (msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        // callback && (setTimeout(function() {
        //   callback();
        // }, 1500));
        callback && callback();
      }
    });
  },

  /**
   * get请求
   */
  _get: function (url, data, success, fail, complete, check_login) {
    wx.showNavigationBarLoading();
    let App = this;
    // 构造请求参数
    data = data || {};

    // if (typeof check_login === 'undefined')
    //   check_login = true;

    // 构造get请求
    let request = function () {
      data.token = wx.getStorageSync('token');
      data.user_id = wx.getStorageSync('user_id');
      wx.request({
        url: App.api_root + url,
        header: {
          'content-type': 'application/json'
        },
        data: data,
        success: function (res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            //console.log(res);
            App.showError('网络请求出错');
            return false;
          }
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            wx.hideNavigationBarLoading();
            App.doLogin();
          } else if (res.data.code === 0) {
            App.showError(res.data.msg);
            return false;
          } else {
            success && success(res.data);
          }
        },
        fail: function (res) {
          // console.log(res);
          App.showError(res.errMsg, function () {
            fail && fail(res);
          });
        },
        complete: function (res) {
          wx.hideNavigationBarLoading();
          complete && complete(res);
        },
      });
    };
    // 判断是否需要验证登录
    check_login ? App.doLogin(request) : request();
  },

  /**
   * post提交
   */
  _post_form: function (url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let App = this;
    //data.wxapp_id = App.siteInfo.uniacid;
    data.token = wx.getStorageSync('token');
    data.user_id = wx.getStorageSync('user_id');
    wx.request({
      url: App.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          App.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          App.doLogin(function () {
            App._post_form(url, data, success, fail);
          });
          return false;
        } else if (res.data.code === 0) {
          App.showError(res.data.msg, function () {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail: function (res) {
        // console.log(res);
        App.showError(res.errMsg, function () {
          fail && fail(res);
        });
      },
      complete: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  /**
   * 验证是否存在user_info
   */
  validateUserInfo: function () {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 对象转URL
   */
  urlEncode: function urlencode(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(function (_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  },

  /**
   * 设置当前页面标题
   */
  setTitle: function () {
    // let App = this,
    //   wxapp;
    // if (wxapp = wx.getStorageSync('wxapp')) {
    //   wx.setNavigationBarTitle({
    //     title: wxapp.navbar.wxapp_title
    //   });
    // } else {
    //   App.getWxappBase(function () {
    //     App.setTitle();
    //   });
    // }
  },
  

});


