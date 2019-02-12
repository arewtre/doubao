
let App = getApp();
var canUseReachBottom = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //不显示分享
    detail: [],
    comments: [],
    fid: "",
    content: "",
    contents: "",
    repcontent: "",
    len: "",
    placeholder: '点击留言回复...',
    reply_username: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: true,
    op: "",
    repid: "",
    pid:"",
    showLoad: false,
    showAll: false,
    page:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    if (options.op){
      this.setData({
        op: options.op
      });
    }
    this.getForumCommentData();
  },
  //上拉加载更多
  onReachBottom: function () {
    console.log(canUseReachBottom);
    /* ------------------------- */
    if (!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
    /* ------------------------- */
    if (!this.data.showAll) {
      this.getForumCommentData();
      this.setData({
        showLoad: !this.data.showLoad,
      });
    }
  },

  /**
   * 获取留言数据
   */
  getForumCommentData: function () {
    let that = this;
    canUseReachBottom = false;
    // 页数+1
    var pageindex = that.data.page + 1;
    App._get('getMylevelMsg', { page: pageindex, op: that.data.op }, function (result) {
      console.log(result);
      if (result.code === 1) {
        // 设置数据
        that.setData({
          comments: result.data,
          page: pageindex,
          len: result.data.length,
          showLoad: false,
        })
        if (result.data == null || result.data.length <= 0) {
          that.setData({
            showAll: true
          })
        }
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        /* ------------------------- */
        canUseReachBottom = true;//有新数据，触底函数开启，为下次触底调用做准备

      } else {
        App.showError(result.msg);
      }
      wx.hideToast();
    });
  },
  /**
   * 评论提交数据
   */
  submit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e);
    //return;
    let _this = this;
    wx.showToast({
      title: '玩命提交中',
      icon: 'loading'
    });
    App._post_form('addMsg'
      , {
        content: _this.data.content,
        user_id: e.detail.rawData,
        rep_id: _this.data.repid,
        comid: _this.data.pid,
        formId: e.detail.formId,
        uid: _this.data.detail.uid,
        title: _this.data.detail.title
      }
      , function (result) {
        console.log(result);
        if (result.code === 1) {
          _this.getForumCommentData();
          _this.setData({
            content: "",
            placeholder: '点击留言回复...',
            pid: "",
            repid: ""
          })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getForumCommentData();
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
      title: this.data.detail.title,
      imageUrl: this.data.detail.video,
      desc: "",
      path: "/pages/forumDetail/index?id=" + this.data.detail.pid
    };
  },
  forContent: function (e) {
    let that = this;
    let _content = e.detail.value;
    // 禁止输入空格
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var emptyy = re.test(_content);
    if (emptyy) return false;
    //end
    that.setData({
      content: _content
    })
    if (that.data.content) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }

  },
  rewardRose: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  
  backContent: function (e) { //回复的评论
    let _from = e.currentTarget.dataset.from;
    let _id = e.currentTarget.dataset.id;
    let _repid = e.currentTarget.dataset.pid;
    console.log(e.currentTarget.dataset);
    this.setData({
      placeholder: '回复 ' + _from,
      focus: true,
      reply_username: _from,
      pid: _id,
      repid: _repid
    });
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop == 0) {
      this.setData({
        floorstatus: 0
      });
    } else {
      this.setData({
        floorstatus: 1
      });
    }
  },

  goTop: function (t) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },

})