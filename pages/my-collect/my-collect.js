let App = getApp();
var canUseReachBottom = true;
Page({
  data: {
    // 页面元素
    forumList: [],
    scrollTop: 0,
    currentTab: 0,
    page: 0,
    current: "",
    showLoad: false,
    showAll: false,
    title: ""
  },

  onLoad: function (options) {
    // 设置页面标题
    // App.setTitle();
    var that = this;
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    that.setData({
      current: options.current,
      title: options.title,
      userInfo: wx.getStorageSync('userInfo')
    });
    that.setTitle(that);

    getFroumList(that);
    // 隐藏加载框
    wx.hideLoading();
    
  },
  onReady: function () {
    
  },
  //上拉加载更多
  onReachBottom: function () {
    /* ------------------------- */
    if (!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
    /* ------------------------- */
    if (!this.data.showAll) {
      getFroumList(this, this.data.cid);
      this.setData({
        showLoad: !this.data.showLoad,
      });
    }
  },
  onChange(e) {
    console.log(e);
    this.setData({
      current: e.detail.key,
    });
  },
  showOne: function (e) {
    this.setData({
      forumList: [],
      page: 0,
      showLoad: false,
      showAll: false,
      title: e.target.dataset.catname
    });
    getFroumList(this);
    this.setTitle();
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    getFroumList(this);
  },

  /**
   * 设置当前页面标题
   */
  setTitle: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  },

  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop == 0) {
      this.setData({
        floorstatus: 0,
        showCate: 0
      });
    } else if (e.scrollTop > 48) {
      this.setData({
        showCate: 1
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
  wetherLike: function (e) {
    var that = this;
    let changeLike = "forumList[" + e.target.dataset.index + "].like"
    that.setData({
      [changeLike]: !e.target.dataset.like,
    })    
    App._get('toZan', { fid: e.target.dataset.fid}, function (result) {
      console.log(result);
      if (result.code === 1) {
        if (!e.target.dataset.like) {
          wx.showToast({
            title: '感谢您的鼓励！',
            icon: 'none',
            duration: 2000
          })

        } else {
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
  wetherCollect: function (e) {
    var that = this;
    let changeLike = "forumList[" + e.target.dataset.index + "].isCollect"
    that.setData({
      [changeLike]: !e.target.dataset.isCollect,
    }) 
    App._get('toCollect', { fid: e.target.dataset.fid }, function (result) {
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

});
/**
 * 获取forumList数据
 */
function getFroumList(that) {
  canUseReachBottom = false;
  // 页数+1
  var pageindex = that.data.page + 1;
  App._get('getMyCollect', { page: pageindex, cid: that.data.current}, function (res) {
   console.log(res.data);
    if (res.code === 1) {
      var list = res.data;
      list.forEach(function (item, index, array) {
        array[index] = {
          title: item.title,
          id: item.id,
          like:item.like,
          isCollect: item.isCollect,
          date: item.date,
          cdate: item.cdate,
          forum_id: item.forum_id,
          video: item.video,
          imgList: item.imgList,
          views: item.views,
          reps: item.reps,
          userface: item.userface,
          nickname: item.nickname,
          com:item.com
        }
      });
      // 设置数据
      that.setData({
        forumList: that.data.forumList.concat(list),
        page: pageindex,
        showLoad: false,
      })
      //console.log(that.data.forumList);
      if (res.data == null || res.data.length <= 0) {
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
      /* ------------------------- */
    } else {
      App.showError(res.msg);
    }

  });
}

