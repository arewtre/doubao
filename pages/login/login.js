let App = getApp();
let systemInfo = wx.getSystemInfoSync();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 授权登录
   */
  authorLogin: function (e) {
    console.log(e);
    //return;
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        // 发送用户信息
        console.log(res);
        App._post_form('login'
          , {
            code: res.code,
            user_info: e.detail.rawData,
            encrypted_data: e.detail.encryptedData,
            iv: e.detail.iv,
            signature: e.detail.signature,
            systemInfo: systemInfo.brand + '(' + systemInfo.model+')',
            //formId:e.detail.formId
          }
          , function (result) {
            console.log(result);
            if (result.code === 1) {
              // 记录token user_id
              wx.setStorageSync('token', result.data.token);
              wx.setStorageSync('user_id', result.data.uid);
              // 跳转回原页面
              _this.navigateBack();
            }
            else {
              App.showError(result.msg);
            }
          }
          , false
          , function () {
            wx.hideLoading();
          });
      }
    });
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    let currentPage = wx.getStorageSync('currentPage');
    wx.redirectTo({
      url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    });
  },

})