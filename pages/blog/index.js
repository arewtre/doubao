let App = getApp();
var canUseReachBottom = true;
Page({
  data: {
    // 页面元素
    forumList: [],
    scrollTop: 0,
    cates:[],
    currentTab: 0,
    page:0,
    current:0,
    cid:"",
    showLoad:false,
    showAll:false,
    title:"全部美文"
  },   

  onLoad: function () {
    // 设置页面标题
   // App.setTitle();
    var that = this;
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });

    this.setTitle(that);

    // 获取数据
    this.getCateListData();
    getFroumList(this, this.data.cid);
    // 隐藏加载框
     wx.hideLoading();

  },
  //上拉加载更多
  onReachBottom: function () {
    /* ------------------------- */
    if (!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
      /* ------------------------- */
    if (!this.data.showAll){
      getFroumList(this, this.data.cid);
      this.setData({
        showLoad: !this.data.showLoad,
      });
    }
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    getFroumList(this, this.data.cid);
  },
  showOne: function (e) {
    let cid = e.currentTarget.dataset.catid;
    let catename = e.currentTarget.dataset.catename;
    //console.log(catename);
    this.setData({
      cid: cid,
      forumList: [],
      page: 0,
      showLoad: false,
      showAll: false,
      title:catename
    });
    getFroumList(this,cid);
    this.setTitle();
  },

  /**
   * 设置当前页面标题
   */
  setTitle:function() {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  },

  /**
   * 获取forumList数据
   */
  getCateListData: function () {
    let _this = this;
    App._get('getCateList', {}, function (result) {
      console.log(result.data);
      if (result.code === 1) {
        _this.setData({
          cates: result.data
        });       

      } else {
        App.showError(result.msg);
      }
    });
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop ==0) {
      this.setData({
        floorstatus: 0,
        showCate:0
      });
    } else if (e.scrollTop > 48){
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

  onShareAppMessage: function () {
    return {
      title: "豆宝博客",
      desc: "豆宝网博客板块,记录豆宝成长点滴O(∩_∩)O哈哈~",
      path: "/pages/blog/index"
    };
  },
  

});
  /**
   * 获取forumList数据
   */
function getFroumList(that,cid) {
  canUseReachBottom = false;
  // 页数+1
  var pageindex = that.data.page + 1;
  App._get('getForumLists', { page: pageindex ,cid:cid}, function (res) {
    console.log(res.data);
    if (res.code === 1) {
      var list = res.data;
      list.forEach(function (item, index, array) {
        array[index] = {
          title: item.title,
          date: item.date,
          forum_id: item.forum_id,
          defectsname: item.defectsname,
          video: item.video,
          imgList: item.imgList,
          views: item.views,
          reps:item.reps,
          isvideo:item.isvideo,
          userface:item.userface,
          nickname: item.nickname
        }
      });
      // 设置数据
      that.setData({
        forumList: that.data.forumList.concat(list),
        page: pageindex,
        showLoad: false,
      })
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

