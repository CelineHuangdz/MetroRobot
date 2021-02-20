// miniprogram/pages/Self-PassengerFlow/PassengerFlow.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key:"BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT"
});

var allState = (wx.getStorageSync('allState') || [])
var station_map = (wx.getStorageSync('station_map') || {})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_line_select: false,
    start_line_name: '--选择线路--',
    start_station_name: '--选择站点--',
    lines: ['一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线', '十二号线', '十三号线', '十五号线', '十六号线', '十七号线', '十八号线', '浦江线'],
    result: ""
  },

  search(e){
    if(this.data.start_station_name == '--选择站点--'){
      wx.showToast({
        title: '请选择站点！',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
      })
    }
    else{
      var name = this.data.start_station_name
      console.log(name)
      var station_code = station_map[name]
      if (typeof(station_code) == "undefined"){
        wx.request({
          url: 'http://shanziflaskserver.com:5000/find_similar_station',
          data: {
            station_name:JSON.stringify(name)
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'chartset': 'utf-8'
          },
          success: res => {
            console.log(res)
            var similar_name = res.data.similar_name
            station_code = station_map[similar_name]
            if (typeof(station_code) == "undefined"){
              this.setData({
                result: "未查询到该站点"
              })
            }
            else{
              wx.request({
                url: 'http://shanziflaskserver.com:5000/sendQA',
                data: {
                  question:JSON.stringify(e.detail.value)
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'chartset': 'utf-8'
                },
                success: res => {
                  console.log(res)
                  var content = ""
                  if (res.data.train_name.length < 1){
                    content = "未查询到客流量信息"
                  }
                  else if (this.data.start_line_name.length > 0){
                    var lin_name = this.data.start_line_name
                    var flag = 0
                    for (var i = 0; i < res.data.train_name.length; i++){
                      if (res.data.train_name[i] == lin_name){
                        flag = 1
                        content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                        content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                      }
                    }
                    if(flag == 0){
                      //content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
                      for (var i = 0; i < res.data.train_name.length; i++){
                        content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                        content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                      }
                    }
                  }
                  else{
                    for (var i = 0; i < res.data.train_name.length; i++){
                      content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                      content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                    }
                  }
                  this.setData({
                    result: content
                  })
                }
              })
            }
          }
        })
      }
      else{
        wx.request({
          url: 'http://shanziflaskserver.com:5000/get_train_load',
          data: {
            station_code:JSON.stringify(station_code)
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'chartset': 'utf-8'
          },
          success: res => {
            console.log(res)
            var content = ""
            if (res.data.train_name.length < 1){
              content = "未查询到客流量信息"
            }
            else if (this.data.start_line_name.length > 0){
              var lin_name = this.data.start_line_name
              var flag = 0
              for (var i = 0; i < res.data.train_name.length; i++){
                if (res.data.train_name[i] == lin_name){
                  flag = 1
                  content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                }
              }
              if(flag == 0){
                //content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
                for (var i = 0; i < res.data.train_name.length; i++){
                  content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                  content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                }
              }
            }
            else{
              for (var i = 0; i < res.data.train_name.length; i++){
                content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
              }
            }
            this.setData({
              result: content
            })
          }
        })
      }
    }
  },

  // 点击下拉框 
  bindShowMsgStartLine() {
    this.setData({
      start_line_select: !this.data.start_line_select
    })
  },

  // 已选下拉框 
  mySelectStartLine(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name 
    var find_stations = []
    for(let i =0; i<=18; i++){
        if(name == allState[i].line_name){
          find_stations = allState[i].stations;
          break;
        }
    }
    this.setData({
      start_line_name: name,
      start_line_select: false,
      start_station_name: '--选择站点--',
      stations: find_stations
    })
  },

  // 点击下拉框 
  bindShowMsgStartStation() {
    if(this.data.start_line_name == '--选择线路--'){
      wx.showToast({
        title: '请先选择线路！',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
      })
    }
    else{
      this.setData({
        start_station_select: !this.data.start_station_select
      })
    }

  },

  // 已选下拉框 
  mySelectStartStation(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name 
   
    this.setData({
      start_station_name: name,
      start_station_select: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})