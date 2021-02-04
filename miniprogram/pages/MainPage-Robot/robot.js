// miniprogram/pages/MainPage-Robot/robot.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var contentLabel = ['LOC','FAC','LIN','SEC','RUL','TIC','SUR'];

function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      contentLabel: 'welcome',
      content: '欢迎来到地铁智能客服！'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    //this.setData({
    //  cusHeadIcon: app.globalData.userInfo.avatarUrl,
    //});
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

  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function(e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });

    wx.request({
      url: 'http://124.70.204.224:5000/sendQA',
      data: {
          question:JSON.stringify(e.detail.value)
//this.data.question为用户输入的问句，字符串类型
      },
      method: "POST",
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
      },
      success: res => {
        console.log(res.data);
        /*
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content: 'hello'
        })
        this.setData({
          msgList,
          inputVal
        });
        */
      }
    })

  },

  toBackClick: function() {
    wx.navigateBack({})
  }

})