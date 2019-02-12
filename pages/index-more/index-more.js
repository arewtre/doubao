let App = getApp();
Page({
  data: {
    comment:[],
    fid:"",
    val:""
  },
  onLoad: function (options) {
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    console.log(options.id);
    this.setData({
      fid: options.id
    });
    this.getForumCommentData();

  },
  /**
   * 获取评论数据
   */
  getForumCommentData: function () {
    let _this = this;
    App._get('getForumComment', { fid: _this.data.fid ,limit:10}, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          comment: result.data,

        });

      } else {
        App.showError(result.msg);
      }
      wx.hideToast();
    });
  },
  /**
   * 评论提交数据
   */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //return;
    let _this = this;
    wx.showToast({
      title: '玩命提交中',
      icon: 'loading'
    });
    App._post_form('addComment'
      , {
        content: e.detail.value.content,
        user_id: e.detail.rawData,
        fid: _this.data.fid
      }
      , function (result) {
        console.log(result);
        if (result.code === 1) {
          _this.getForumCommentData();
          _this.setData({
            val: "",

          });
        }
        else {
          App.showError(result.msg);
        }
      }
      , false
      , function () {
        wx.hideLoading();
      });
  },
  onShow: function (options) {

  },
  onLaunch: function (options) {
  }
});