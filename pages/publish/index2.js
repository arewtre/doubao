// pages/publish/index.js
let App = getApp();
import { $wuxSelect } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: '',
    title: '',
    cate: '',
    keywords: "",
    fileList: [],
    content: [],
    cates: [],
    display: "true",
    token: wx.getStorageSync('token'),
    user_id: wx.getStorageSync('user_id'),
    isVideo: false
  },
  onClick2() {
    $wuxSelect('#wux-select2').open({
      value: this.data.pid,
      options: this.data.cates,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            pid: value,
            cate: options[index].title,
          })
          if (value == 80) {
            this.setData({
              isVideo: true,
            })
          }
          console.log(this.data.pid);
        }
      },
    })
  },
  /**
   * 获取板块数据
   */
  getCateListData: function () {
    let that = this;
    App._get('getCateList', {}, function (result) {
      console.log(result.data);
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
  onChange(e) {
    console.log('onChange', this.data.fileList);
    const { file } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
    }
  },
  onSuccess(e) {
    //console.log('onSuccess', e)
  },
  onFail(e) {
    //console.log('onFail', e)
  },
  onComplete(e) {
    console.log('onComplete', e.detail);
    let res = JSON.parse(e.detail.data);
    if (res.code === 1) {
      console.log('onComplete', res);
      this.setData({
        content: this.data.content.concat(res.data.url),
      })
      if (this.data.pid == 80) {
        this.setData({
          fileList: res.data.url,
        })
      }
    }
    wx.hideLoading()
  },
  onProgress(e) {
    //console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onPreview(e) {
    console.log('onPreview', e)
    const { file, fileList } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onRemove(e) {
    const { file, fileList } = e.detail
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          })
        }
      },
    })
  },
  onChange1(e) {
    console.log('onChange', e)
    this.setData({
      title: e.detail.value,
    })
  },
  onChange2(e) {
    console.log('onChange', e)
    this.setData({
      keywords: e.detail.value,
    })
  },
  onChange3(e) {
    console.log('onChange', e)
    this.setData({
      textarea: e.detail.value,
    })
  },
  /**
   * 发布提交数据
   */
  submit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //return;
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

    if (_this.data.content == "") {
      wx.showToast({
        title: '请选择图片!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showToast({
      title: '玩命提交中',
      icon: 'loading'
    });
    App._post_form('publish'
      , {
        content: _this.data.content,
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
                _this.setData({
                  pid: "",
                  title: "",
                  content: "",
                  keywords: "",
                  fileList: "",
                })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCateListData();
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


})