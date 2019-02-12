let App = getApp();
var canUseReachBottom = true;
Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true,  // 是否显示面板指示点	
    autoplay: true,       // 是否自动切换
    interval: 3000,       // 自动切换时间间隔
    duration: 800,        // 滑动动画时长
    imgHeights: {},       // 图片的高度
    imgCurrent: {},       // 当前banne所在滑块指针

    // 页面元素
    banner: {},
    forumTop: {},
    forumList: [],
    gonggao:[],
    memberList: {},
    scrollTop: 0,
    currentIndex:0,
    page: 0,
    showLoad: false,
    showAll: false,
  },

  onLoad: function () {
    // 设置页面标题
    App.setTitle();
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    // 获取首页数据
    this.getBannerData();
    this.getForumData();
    getFroumList(this);
    this.getMemberListData();
    this.getGgData();
    
  },
  //上拉加载更多
  onReachBottom: function () {
    /* ------------------------- */
    if (!canUseReachBottom) return;//如果触底函数不可用，则不调用网络请求数据
    /* ------------------------- */
    if (!this.data.showAll) {
      getFroumList(this);
      this.setData({
        showLoad: !this.data.showLoad,
      });
    }
  },

  /**
   * 获取banner数据
   */
  getBannerData: function () {
    let _this = this;
    App._get('getBanner', {}, function (result) {
      //console.log(result);
      if (result.code === 1) {
        _this.setData({
          banner:result.data
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 获取公告数据
   */
  getGgData: function () {
    let _this = this;
    App._get('getGg', {}, function (result) {
      //console.log(result);
      if (result.code === 1) {
        _this.setData({
          gonggao: result.data
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 获取置顶forum数据
   */
  getForumData: function () {
    let _this = this;
    App._get('getForumTop', {}, function (result) {
      //console.log(result);
      if (result.code === 1) {
        _this.setData({
          forumTop: result.data
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 获取最新用户数据
   */
  getMemberListData: function () {
    let _this = this;
    App._get('getMemberList', {}, function (result) {
      //console.log(result);

      if (result.code === 1) {
        _this.setData({
          memberList: result.data
        });
      } else {
        App.showError(result.msg);
      }
      // wx.hideToast();
    });
  },


  // toDetail(event) {
  //   console.log(event);
  //   //获取点击跳转对应的下标
  //   let index = event.currentTarget.dataset.index
  //   wx.navigateTo({
  //     url: '/pages/forumDetail/index?index=' + index,
  //   })
  // },


  /**
   * 计算图片高度
   */
  imagesHeight: function (e) {
    let imgId = e.target.dataset.id,
      itemKey = e.target.dataset.itemKey,
      ratio = e.detail.width / e.detail.height, // 宽高比
      viewHeight = 750 / ratio, // 计算的高度值
      imgHeights = this.data.imgHeights;

    // 把每一张图片的对应的高度记录到数组里
    if (typeof imgHeights[itemKey] === 'undefined') {
      imgHeights[itemKey] = {};
    }
    imgHeights[itemKey][imgId] = viewHeight;
    // 第一种方式
    let imgCurrent = this.data.imgCurrent;
    if (typeof imgCurrent[itemKey] === 'undefined') {
      imgCurrent[itemKey] = Object.keys(this.data.items[itemKey].data)[0];
    }
    this.setData({ imgHeights, imgCurrent });
  },

  bindChange: function (e) {
    let itemKey = e.target.dataset.itemKey
      , imgCurrent = this.data.imgCurrent;
    // imgCurrent[itemKey] = e.detail.current;
    imgCurrent[itemKey] = e.detail.currentItemId;
    this.setData({ imgCurrent });
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
  viewmore:function(t){
    wx.switchTab({
      url: '../blog/index'
    });
  },

  onShareAppMessage: function () {
    return {
      title: "豆宝网首页",
      desc: "",
      path: "/pages/index/index"
    };
  }
});

/**
  * 获取forumList数据
  */
function getFroumList(that) {
  canUseReachBottom = false;
  // 页数+1
  var pageindex = that.data.page + 1;
  //console.log(pageindex);
  App._get('getForumList', { page: pageindex}, function (res) {
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
          isvideo: item.isvideo,
          imgList: item.imgList,
          views: item.views,
          reps: item.reps,
          userface: item.userface,
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

