
let App = getApp();
Page({
  data: {
    active: 0,
    show:false,
    value: '',
    express:[],
    expCom:[],
    areaIndex: 0,
    area: ['点击选择', '申通', 'EMS', '顺丰', '圆通', '中通', '韵达', '天天', '汇通', '全峰', '德邦', '宅急送'],
    realvalue: ['', 'shentong', 'ems', 'shunfeng', 'yuantong', 'zhongtong', 'yunda', 'tiantian', 'huitongkuaidi', 'quanfengkuaidi', 'debangwuliu', 'zhaijisong']
  },
  //获取快递公司
  bindPickerChange: function (e) {
    //console.log(this.data.realvalue[e.detail.value])
    this.setData({            
      expCom: this.data.realvalue[e.detail.value],
      areaIndex: e.detail.value
    })
  },

  //获取快递单号
  passWdInput: function (e) {
    this.setData({
      expCode: e.detail.value
    })
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  onSearch(event) {
    let _this = this;
    if (_this.data.expCom=="") {
      wx.showToast({
        title: '请选择物流公司!',
        icon: 'none'
      });
      return;
    }
    if (!_this.data.expCode) {
      wx.showToast({
        title: '请输入物流单号!',
        icon: 'none'
      });
      return;
    }
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
      App._get('getExpress', { expCom: _this.data.expCom,expCode:_this.data.expCode}, function (result) {
        console.log(result);
        if (result.code === 1) {
          _this.setData({
            express: result.data.data
          });
        
        } else {
          App.showError(result.data.msg);
        }
        // 隐藏加载框
        wx.hideLoading();
      });
    
  },

  onCancel() {
    wx.showToast({
      title: '取消',
      icon: 'none'
    });
  },

  onLoad(){
    //this.getExpCom();
    //this.getExpress();
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData;
        console.log(encryptedData);
      }
    })
    if(!wx.getStorageSync('user_id')){
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  /**
   * 获取物流公司数据
   */
  getExpCom: function () {
    let _this = this;
    App._get('getExpCom', {}, function (result) {
      //console.log(result);
      if (result.code === 1) {
        _this.setData({
          expCom: result.data
        });
      } else {
        App.showError(result.msg);
      }
    });
  },

  /**
   * 获取物流信息数据
   */
  getExpress: function () {
    let _this = this;
    wx.showToast({
      title: '玩命加载中',
      icon: 'loading'
    });
    App._get('getExpress', {}, function (result) {
      console.log(result);
      if (result.code === 1) {
        _this.setData({
          express: result.data.data
        });
      } else {
        App.showError(result.data.msg);
      }
      // 隐藏加载框
      wx.hideLoading();
    });
  },
  getScanCode: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        // this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        that.setData({
          expCode: res.result
        })
        // wx.showToast({
        //   title: '成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  }
  
  
});
