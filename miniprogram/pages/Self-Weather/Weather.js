// miniprogram/pages/Self-Weather/Self-Weather.js

var amapFile = require('../../libs/amap-wx');
var weather = {};

function initData(that) {
  that.setData({
    weather
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    initData(this);
    var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'fe66bfdd0a6edc6712d6794dd806de84'});
    myAmapFun.getWeather({
      success: function(data){
        that.setData({
          weather: data
        });
        console.log(data)
        //成功回调
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })
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
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          // 已经授权
          console.log("已经授权地址信息")
        }else{
          // 未授权，跳转到授权页面
          console.log("还没有授权地址信息")
          /*
          wx.reLaunch({
            url: '/pages/auth/auth',
          })
          */
        }
      }
    })
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

  }
})