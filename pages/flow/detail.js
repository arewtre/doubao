//index.js
//获取应用实例
let App = getApp();
Page({
  data: {
    images: [],
    scroll_H: 0,
    imgWidth: 0,
    oneimages: [],
    twoimages: [],
    threeimages: [],
    oImageIndex: [],
    index: 0,
    tempindex: 0,
    touchStartClientY: 0

  },
  onReachBottom: function () {
    //console.log('onReachBottom')
    var that = this
    that.setData({
      hidden: false,
    });
    requestData(that, mCurrentPage + 1);
  },
  onLoad: function () {
    //console.log('onLoad')
    var that = this
    wx.getSystemInfo({//获取屏幕宽高
      success: function (res) {

        var _width = res.windowWidth;
        var imgWidth = _width * 0.48; //样式表里面设置的宽度
        var scroll_H = res.windowHeight * (750 / res.windowWidth);

        that.setData({
          scroll_H: scroll_H,
          imgWidth: imgWidth
        })
      }
    })
    requestData(that, mCurrentPage + 1);
    //requestGetCate(that);


  },
  loadimg: function (e) {//图片加载完成执行


    var index = e.currentTarget.id;
    //console.log(index)
    var oImageIndex = this.data.oImageIndex;

    var tempIndex = 0;
    for (var i = 0; i < oImageIndex.length; i++) {
      if (oImageIndex[i] == index) {
        tempIndex = i;
        break;
      }
    }
    //console.log(oImageIndex);
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth / oImgW;//比例计算
    var oImgH = e.detail.height;//图片原始高度
    var _imgHeight = oImgH * scal;//自适应高度
    var images = this.data.images;
    images[index].height = _imgHeight;
    oImageIndex.splice(tempIndex, 1);
    this.setData({
      oImageIndex: oImageIndex,
      images: images
    })

    var oneimages = this.data.oneimages;
    var twoimages = this.data.twoimages;
    if (oImageIndex.length == this.data.index) { //当加载完最后一张图片执行
      var oneImageH = 0;
      var twoImageH = 0;
      for (var i = this.data.index; i < images.length; i++) {
        if (i > 0) { //第一张除外
          if (oneImageH > twoImageH) {
            twoImageH += images[i].height;
            twoimages.push(images[i]);
          } else {
            oneImageH += images[i].height;
            oneimages.push(images[i]);
          }
        } else {
          oneImageH += images[i].height;
          oneimages.push(images[i])
        }
      }
      this.data.index = this.data.tempindex
      //console.log(this.data.index);
    }

    this.setData({
      oneimages: oneimages,
      twoimages: twoimages
    })
  }
})

/**
 * 定义几个数组用来存取item中的数据
 */
var mUrl = [];

var mCurrentPage = 0;

/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 * @param targetPage 请求的目标页码
 */
function requestData(that, targetPage) {

  wx.showToast({
    title: '加载中',
    icon: 'loading'
  });
  let _this = that;
  App._get('getImages', { page: targetPage, id: that.options.id  }, function (res) {
    console.log(res);
    if (res.code === 1) {
      if (res == null || res.data == null || res.data.length <= 0) {

        console.error("god bless you...");
        return;
      }


      for (var i = 0; i < res.data.length; i++) {
        bindData(res.data[i]);
      }

      //将获得的各种数据写入itemList，用于setData
      var itemList = [];
      //console.log(mUrl.length)

      for (var i = 0; i < mUrl.length; i++) {
        itemList.push({ pic: mUrl[i], height: 0 });
      }

      //console.log(itemList)


      that.setData({
        images: itemList,
        hidden: true,
        tempindex: mUrl.length
        // loadmorehidden:false,
      });

      mCurrentPage = targetPage;
      aaa(_this);

    } else {
      App.showError(result.msg);
    }
    wx.hideToast();
  });



}

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */
function bindData(itemData) {

  //var url = itemData.image_url.replace("//ww", "//ws");
  //console.log(itemData);
  var url = itemData.image_url;

  mUrl.push(url);

}

function aaa(that) {
  var images = that.data.images;
  //console.log(images);
  var oImageIndex = [];//把数组下标存入临时对象中
  for (var i = 0; i < images.length; i++) {
    oImageIndex.push(i);

  }

  that.setData({
    oImageIndex: oImageIndex
  })
}

