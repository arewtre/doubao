
let App = getApp();
var WxParse = require('../../wxParse/wxParse.js')
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
    toastHidden: true,
    len: "",
    placeholder: '点击评论回复...',
    reply_username: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: true,
    like:false,
    isCollect:false,
    likenum:0,
    pid:"",
    repid:""
  },

  swiperHandle: function (e) {

    this.setData({
      swiperCurrentIdx: e.detail.current + 1
    })
  },

  //打开评论弹出层
  toggleDialogHandle: function () {
    console.log(wx.getStorageSync('token'));
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
      return;
    }

    this.showDialog = !this.showDialog;
    this.setData({
      showDialog: this.showDialog
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    this.setData({
      fid: options.id
    });
    this.getForumDetailData();
    this.getForumCommentData();
  },

  /**
   * 获取详情数据
   */
  getForumDetailData: function () {
    let _this = this;
    App._get('getForumDetail', { fid: _this.data.fid }, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          detail: result.data,
          likenum: result.data.zan,
          like: result.data.like,
          isCollect: result.data.isCollect,
          contents: WxParse.wxParse('contents', 'html', result.data.content, _this, 5)
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 获取评论数据
   */
  getForumCommentData: function () {
    let _this = this;
    App._get('getForumComment', { fid: _this.data.fid }, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          comments: result.data,
          len: result.data.length

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
  submit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e);
    //return;
    let _this = this;
    wx.showToast({
      title: '玩命提交中',
      icon: 'loading'
    });
    App._post_form('addComment'
      , {
        content: _this.data.content,
        user_id: e.detail.rawData,
        fid: _this.data.fid,
        rep_id:_this.data.repid,
        comid: _this.data.pid,
        formId: e.detail.formId,
        uid: _this.data.detail.uid,
        title: _this.data.detail.title
      }
      , function (result) {
        console.log(result);
        if (result.code === 1) {
          _this.toggleDialogHandle();
          _this.getForumCommentData();
          _this.getForumDetailData();
          _this.setData({
            content:"",
            placeholder: '点击评论回复...',
            pid:"",
            repid:""
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
      desc: this.data.detail.des,
      path: "/pages/forumDetail/index?id=" + this.data.fid
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
    // wx.showModal({
    //   content: '您的分享与关注是对我最大的奖赏！',
    //   cancelText: '朕不分享',
    //   cancelColor: '#999',
    //   confirmText: '乐意效劳',
    //   confirmColor: '#1d8f59',
    //   success: function(res) {
    //     console.log(res)
    // // 最后这一步似乎小程序不能成功，只能自己写一个组件了
        
    //     if (res.cancel) {
    //       //点击取消,默认隐藏弹框
    //     } else {
    //       //点击确定
    //       that.onShareAppMessage();
    //     }
    //   }
    // })
  },
  wetherLike: function () {
    var that = this;
    that.setData({
      like: !that.data.like
    })
    App._get('toZan', { fid: that.data.fid, like: that.data.like }, function (result) {
      console.log(result);
      if (result.code === 1) {
        if (that.data.like) {
          that.setData({
            likenum: that.data.likenum*1 + 1*1
          })
          wx.showToast({
            title: '感谢您的鼓励！',
            icon: 'none',
            duration: 2000
          })

        } else {
          that.setData({
            likenum: that.data.likenum - 1
          })
          wx.showToast({
            title: '我会继续努力！',
            icon: 'none',
            duration: 2000
          })
        }

      } else {
        App.showError(result.msg);
      }
      //wx.hideToast();
    });    
  },
  wetherCollect: function () {
    var that = this;
    that.setData({
      isCollect: !that.data.isCollect
    })
    App._get('toCollect', { fid: that.data.fid, isCollect: that.data.isCollect }, function (result) {
      console.log(result);
      if (result.code === 1) {      
          wx.showToast({
            title: result.data.msg,
            icon: 'none',
            duration: 2000
          })
        
      } else {
        App.showError(result.msg);
      }
      //wx.hideToast();
    });
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
      repid:_repid
    });
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        backShow: true
      });
    } else {
      this.setData({
        backShow: false
      });
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },
  // 评论输入框聚焦时，设置与底部的距离
  settingMbShow: function () {
    this.setData({
      inputMarBot: true
    })
  },
  //  评论输入框失去聚焦时，设置与底部的距离（默认状态）
  settingMbNoShow: function () {
    this.setData({
      inputMarBot: false
    })
  },
  
})