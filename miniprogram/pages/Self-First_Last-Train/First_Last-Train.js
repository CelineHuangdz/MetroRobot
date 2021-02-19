// miniprogram/pages/Self-First_Last-Train/First_Last-Train.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key:"BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT"
});

var station = new Map([['310100025685','地铁1号线'],["310100025693","地铁2号线"],
["310100034534","地铁3号线"],["310100034536","地铁4号线"],
["310100034538","地铁5号线"],["900000059516","地铁5号线"],
["310100024540","地铁6号线"],["310100024542","地铁7号线"],
["310100025709","地铁8号线"],["310100024546","地铁9号线"],
["310100027703","地铁10号线"],["310100027704","地铁10号线"],
["310100027601","地铁11号线"],["310100024518","地铁11号线"],
["310100025711","地铁12号线"],["310100024524","地铁13号线"],
["310100024526","地铁16号线"],["900000039799","地铁17号线"],
["900000039797","轨道交通浦江线"],["310100104512","磁悬浮"],
["310100025685002","富锦路"],["310100025685029","莘庄"],
["310100025693024","浦东国际机场"],["310100025693023","徐泾东"],
["310100034534002","江杨北路"],["310100025685025","上海南站"],
["310100024518028","东方体育中心"],["310100024540029","港城路"],
["310100024542002","花木路"],["310100024542034","美兰湖"],
["310100025709031","沈杜公路"],["310100025709002","市光路"],
["310100024546036","曹路"],["310100024546002","松江南站"],
["310100027703028","新江湾城"],["310100027703002","航中路"],
["310100025693022","虹桥火车站"],["310100027601002","嘉定北"],
["310100024518036","迪士尼"],["310100024518002","花桥"],
["310100025711033","七莘路"],["310100024546033","金海路"],
["310100024524008","金运路"],["310100024524021","张江路"],
["310100024526002","滴水湖"],["310100024526014","龙阳路"],
["900000039799001","东方绿舟"],["900000039797001","汇臻路"],
["310100027703009","虹桥路"],["310100025685023","上海体育馆"],
["310100024546017","宜山路"],["310100034534024","延安西路"],
["310100025693016","中山公园"],["310100024524002","金沙江路"],
["310100024518019","曹杨路"],["310100024542019","镇坪路"],
["310100034534019","中潭路"],["310100025685014","上海火车站"],
["310100034534017","宝山路"],["310100027703019","海伦路"],
["310100034536013","临平路"],["310100025711013","大连路"],
["310100034536015","杨树浦路"],["310100027599021","浦东大道"],
["310100024540013","世纪大道"],["310100034536018","浦电路(4号线)"],
["310100024540011","蓝村路"],["310100034536020","塘桥"],
["310100034536021","南浦大桥"],["310100025709020","西藏南路"],
["310100034536023","鲁班路"],["310100025711022","大木桥路"],
["310100024542013","东安路"],["310100034536026","上海体育场"],
["900000059516009","奉贤新城"],["310100034538012","闵行开发区"],
["310100024530010","浦东国际机场"],["310100024530002","广兰路"],["900000113361","地铁二号线定点班车"]])

var allState = (wx.getStorageSync('allState') || [])

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
      wx.request({  //地铁信息
        url: 'https://map.amap.com/service/subway?_1469083453978&srhdata=3100_drw_shanghai.json&s=1',
        method:'GET',
        data:{
        },
        success: res => {
          console.log(res.data)
          let r = ''
          let si = ''
          var station_clean = this.data.start_station_name
          for(let i = 0; i < res.data.l.length; i++){
            for(let j = 0; j < res.data.l[i].st.length; j++){
              if(res.data.l[i].st[j].n == station_clean){
                r = res.data.l[i].st[j].r.substring(0,12);
                si = res.data.l[i].st[j].si;
              }
            }
          }
          if (r.length == 0){
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '未找到匹配站点'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
          else{
            wx.request({  //首末班车
              url: 'https://map.amap.com/service/subway?_1469083453980&srhdata=3100_info_shanghai.json&s=1',
              method:'GET',
              data:{
              },
              success: res => {
                console.log(res.data)
                let content = ''
                for(let i = 0; i < res.data.l.length; i++){
                  if(res.data.l[i].ls == r){
                    for(let j = 0; j < res.data.l[i].st.length; j++){
                      if(res.data.l[i].st[j].si == si){
                        if (this.data.start_line_name.length > 0){
                          var line_name = this.data.start_line_name
                          if (line_name != "浦江线"){
                            line_name = "地铁" + line_name
                          }
                          else{
                            line_name = "轨道交通浦江线"
                          }
                          var flag = 0
                          for(let t = 0; t < res.data.l[i].st[j].d.length; t++){
                            if (line_name == station.get(res.data.l[i].st[j].d[t].ls)){
                              flag = 1
                              content += station.get(res.data.l[i].st[j].d[t].ls) + station.get(res.data.l[i].st[j].d[t].n) + '方向 \n 首班车：' + res.data.l[i].st[j].d[t].ft + ' 末班车：' + res.data.l[i].st[j].d[t].lt + ' \n '
                              console.log('xianlu:' + station.get(res.data.l[i].st[j].d[t].ls) + ',fangxiang:' + station.get(res.data.l[i].st[j].d[t].n) + ',shou:' + res.data.l[i].st[j].d[t].ft + ',mo:' + res.data.l[i].st[j].d[t].lt)
                            }
                          }
                          if (flag == 0){
                            //content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
                            for(let t = 0; t < res.data.l[i].st[j].d.length; t++){
                              content += station.get(res.data.l[i].st[j].d[t].ls) + station.get(res.data.l[i].st[j].d[t].n) + '方向 \n 首班车：' + res.data.l[i].st[j].d[t].ft + ' 末班车：' + res.data.l[i].st[j].d[t].lt + ' \n '
                              console.log('xianlu:' + station.get(res.data.l[i].st[j].d[t].ls) + ',fangxiang:' + station.get(res.data.l[i].st[j].d[t].n) + ',shou:' + res.data.l[i].st[j].d[t].ft + ',mo:' + res.data.l[i].st[j].d[t].lt)
                            }
                          }
                        }
                        else{
                          for(let t = 0; t < res.data.l[i].st[j].d.length; t++){
                            content += station.get(res.data.l[i].st[j].d[t].ls) + station.get(res.data.l[i].st[j].d[t].n) + '方向 \n 首班车：' + res.data.l[i].st[j].d[t].ft + ' 末班车：' + res.data.l[i].st[j].d[t].lt + ' \n '
                            console.log('xianlu:' + station.get(res.data.l[i].st[j].d[t].ls) + ',fangxiang:' + station.get(res.data.l[i].st[j].d[t].n) + ',shou:' + res.data.l[i].st[j].d[t].ft + ',mo:' + res.data.l[i].st[j].d[t].lt)
                          }
                        }
                      }
                    }
                  }
                }
                console.log(content)
                this.setData({
                  result: content
                });
              }
            })
          }
        }
      })

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