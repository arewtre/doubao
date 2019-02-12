// pages/publish/index.js
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')
let App = getApp();
import { $wuxSelect } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: '',
    title: '',
    cate: '请选择板块',
    fid:"",
    keywords:"",
    fileList: [],
    content:[],
    cates:[],
    display:"true",
    token: wx.getStorageSync('token'),
    user_id: wx.getStorageSync('user_id'),
    isVideo:false,
    upFilesBtn: true,
    upFilesProgress: false,
    maxUploadLen: 9,
  },
  onClick2() {
    $wuxSelect('#wux-select2').open({
      value: this.data.pid,
      options: this.data.cates,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            pid: value,
            cate: options[index].title,
          })
          if(value==80){
            this.setData({
              isVideo: true,
            })
          }
          //console.log(this.data.pid);
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);   
    // if (options.id) {
    //   this.setData({
    //     fid: options.id,
    //   });
      
    //   this.getForumDetailData();
    // }
    this.getCateListData();
    //console.log(this.data.title);
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.onLoad()
    }
  },
  /**
   * 获取详情数据
   */
  getForumDetailData: function () {
    let _this = this;
    App._get('getForumDetail', { fid: _this.data.fid }, function (result) {
      console.log(result.data.title);
      if (result.code === 1) {
        _this.setData({
          //detail: result.data,
          title: result.data.title,
          keywords: result.data.keywords,
          textarea: result.data.description,
          pid: result.data.pid,
        //  contents: result.data.description,
          cate: result.data.defectsname,
         // upImgArr: result.data.imgList
        });
        console.log(_this.data);
      } else {
        App.showError(result.msg);
      }
    });
  },
  /**
   * 获取板块数据
   */
  getCateListData: function () {
    let that = this;
    App._get('getCateList', {}, function (result) {
      //console.log(result.data);
      if (result.code === 1) {
        var list = result.data;
        list.forEach(function (item, index, array) {
          array[index] = {
            value: item.id,
            title: item.defectsname,
          }
        });
        // 设置数据
        that.setData({
          cates: list,
        })

      } else {
        App.showError(result.msg);
      }
    });
  },
  // 预览图片
  previewImg: function (e) {
    let imgsrc = e.currentTarget.dataset.presrc;
    let _this = this;
    let arr = _this.data.upImgArr;
    let preArr = [];
    arr.map(function (v, i) {
      preArr.push(v.path)
    })

    wx.previewImage({
      current: imgsrc,
      urls: preArr
    })
  },
  // 删除上传图片 或者视频
  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除嘛？',
      success: function (res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let upImgArr = _this.data.upImgArr;
          let upVideoArr = _this.data.upVideoArr;
          if (delType == 'image') {
            upImgArr.splice(delNum, 1)
            _this.setData({
              upImgArr: upImgArr,
            })
          } else if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            _this.setData({
              upVideoArr: upVideoArr,
            })
          }
          let upFilesArr = upFiles.getPathArr(_this);
          if (upFilesArr.length < _this.data.maxUploadLen) {
            _this.setData({
              upFilesBtn: true,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  // 选择图片或者视频
  uploadFiles: function (e) {
    var _this = this;
    wx.showActionSheet({
      itemList: ['拍照上传', '选择图片', '选择视频'],
      success: function (res) {
        //   console.log(res.tapIndex)
        let xindex = res.tapIndex;
        if (xindex == 1 || xindex ==0) {
          upFiles.chooseImage(_this, _this.data.maxUploadLen)
        } else if (xindex == 2) {
          upFiles.chooseVideo(_this, _this.data.maxUploadLen)
        }

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 上传文件
  subFormData: function () {
    let _this = this;
    let upData = {};
    let upImgArr = _this.data.upImgArr;
    let upVideoArr = _this.data.upVideoArr;
    _this.setData({
      upFilesProgress: true,
    })
    upData['url'] = "uploads";
    upFiles.upFilesFun(_this, upData, function (res) {
      if (res.index < upImgArr.length) {
        upImgArr[res.index]['progress'] = res.progress

        _this.setData({
          upImgArr: upImgArr,
        })
      } else {
        let i = res.index - upImgArr.length;
        upVideoArr[i]['progress'] = res.progress
        _this.setData({
          upVideoArr: upVideoArr,
        })
      }
      //   console.log(res)
    }, function (arr) {
      // success
      console.log(arr)
    })
  },
  onChange1(e) {
    //console.log('onChange', e)
    this.setData({
      title: e.detail.value,
    })
  },
  onChange2(e) {
    //console.log('onChange', e)
    this.setData({
      keywords: e.detail.value,
    })
  },
  onChange3(e) {
    //console.log('onChange', e)
    this.setData({
      textarea: e.detail.value,
    })
  },
  /**
   * 发布提交数据
   */
  submit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let _this = this;
    if (_this.data.title == "") {
      wx.showToast({
        title: '请填写标题!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (_this.data.pid == "") {
      wx.showToast({
        title: '请选择板块!',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (_this.data.uploadedPathArr == "") {
      wx.showToast({
        title: '请选择图片!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showToast({
      title: '附件上传中..',
      icon: 'loading',
      mask: true
    });
    let upData = {};
    let upImgArr = _this.data.upImgArr;
    let upVideoArr = _this.data.upVideoArr;
    _this.setData({
      upFilesProgress: true,
    })
    upData['url'] = "https://wx.linxinran.cn/api/uploads?user_id=" + _this.data.user_id;
    upFiles.upFilesFun(_this, upData, function (res) {
      if (res.index < upImgArr.length) {
        upImgArr[res.index]['progress'] = res.progress

        _this.setData({
          upImgArr: upImgArr,
        })
      } else {
        let i = res.index - upImgArr.length;
        upVideoArr[i]['progress'] = res.progress
        _this.setData({
          upVideoArr: upVideoArr,
        })
      }
         console.log(res)
    }, function (arr) {
      // success
      console.log(arr);
      _this.publish(_this);
    })  
    
  },
  publish: function (_this){
    wx.showToast({
      title: '正在发布中..',
      icon: 'loading',
      mask: true
    });
    App._post_form('publish'
      , {
        content: _this.data.uploadedPathArr,
        title: _this.data.title,
        keywords: _this.data.keywords,
        pid: _this.data.pid,
        textarea: _this.data.textarea
      }
      , function (result) {
        console.log(result);
        if (result.code === 1) {
          wx.showModal({
            title: '提示',
            content: '发布成功!您是否要查看?',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../forumDetail/index?id=' + result.data.id
                });
                console.log('用户点击确定')
              } else if (res.cancel) {
                wx.navigateTo({
                  url: "../publish/index"
                });
                console.log('用户点击取消')
              }
            }
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
    this.onLoad();
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.onLoad()
    }
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

  },
  toIndex: function () {
    wx.navigateTo({
      url: '../forumDetail/index?id=285'
    });
  }
  
})