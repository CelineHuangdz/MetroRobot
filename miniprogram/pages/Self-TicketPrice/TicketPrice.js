const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key:"BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT"
});

var allState = [
  {line_name:"一号线", stations:["莘庄","外环路","莲花路","锦江乐园","上海南站","漕宝路","上海体育馆","徐家汇","衡山路","常熟路","陕西南路","黄陂南路","人民广场","新闸路","汉中路","上海火车站","中山北路","延长路","上海马戏城","汶水路","彭浦新村","共康路","通河新村","呼兰路","共富新村","宝安公路","友谊西路","富锦路"]},
  {line_name:"二号线", stations:["徐泾东","虹桥火车站","虹桥2号航站楼","淞虹路","北新泾","威宁路","娄山关路","中山公园","江苏路","静安寺","南京西路","人民广场","南京东路","陆家嘴","东昌路","世纪大道","上海科技馆","世纪公园","龙阳路","张江高科","金科路","广兰路","唐镇","创新中路","华夏东路","川沙","凌空路","远东大道","海天三路","浦东国际机场"]},
  {line_name:"三号线", stations:["上海南站","石龙路","龙漕路","漕溪路","宜山路","虹桥路","延安西路","中山公园","金沙江路","曹杨路","镇坪路","中潭路","上海火车站","宝山路","东宝兴路","虹口足球场","赤峰路","大柏树","江湾镇","殷高西路","长江南路","淞发路","张华浜","淞滨路","水产路","宝杨路","友谊路","铁力路","江杨北路"]},
  {line_name:"四号线", stations:[]},
  {line_name:"五号线", stations:[]},
  {line_name:"六号线", stations:[]},
  {line_name:"七号线", stations:[]},
  {line_name:"八号线", stations:[]},
  {line_name:"九号线", stations:[]},
  {line_name:"十号线", stations:[]},
  {line_name:"十一号线", stations:[]},
]

var station_map = (wx.getStorageSync('station_map') || {})

Page({

  data: {
    DqOpenid: '',
    start_line_select: false,
    start_station_select: false,
    start_line_name: '--选择线路--',
    start_station_name: '--选择站点--',

    lines: ['一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线'],
    stations: [],

    end_line_select: false,
    end_station_select: false,
    end_line_name: '--选择线路--',
    end_station_name: '--选择站点--',

    price: "0"
  },

  searchPrice(e){
    var tprice = "";
    if(this.data.start_station_name == '--选择站点--' || this.data.end_station_name == '--选择站点--'){
      wx.showToast({
        title: '请选择站点！',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
      })
    }
    else if(this.data.start_station_name == this.data.end_station_name){
      wx.showToast({
        title: '起点终点相同！',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
      })
    }
    else{
      wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
              url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
              method:'GET',
              data:{
                address:this.data.start_station_name
              },
              success: res => { 
                var that = this
                const geocodes1 = res.data.geocodes[0]['location']
                console.log(geocodes1)
                var a = geocodes1.split(',')
                var data1=parseFloat(a[0])
                console.log(data1)
                var data2=parseFloat(a[1])
                console.log(data2)
                wx.request({
                  url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
                  method:'GET',
                  data:{
                  address:this.data.end_station_name
              },
                  success: res => { 
                  const geocodes2 = res.data.geocodes[0]['location']
                  console.log(geocodes2)
                  var b = geocodes2.split(',')
                  var data3=parseFloat(b[0])
                  console.log(data3)
                  var data4=parseFloat(b[1])
                  console.log(data4)
                  
                  var start_latitude_s = String(data2);
                  var start_longitude_s = String(data1);
                  var terminal_latitude_s = String(data4);
                  var terminal_longtitude_s = String(data3);
                  var start = start_latitude_s + "," + start_longitude_s
                  var terminal = terminal_latitude_s + "," + terminal_longtitude_s
                  qqmapsdk.direction({
                    mode: 'transit',//'transit'(公交路线规划)
                    //from参数不填默认当前地址
                    from: start,
                    to: terminal, 
                    success: function (res) {
                      console.log(res);
                      var ret = res.result.routes[0];
                      var count = ret.steps.length;
                      var subway_start_list = [];
                      var subway_end_list = [];
                      for(var i = 0; i < count; i++) {
                        if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].vehicle == "SUBWAY") {
                          subway_start_list.push(ret.steps[i].lines[0].geton["title"]);
                          subway_end_list.push(ret.steps[i].lines[0].getoff["title"]);
                        }
                      }
                      var subway_count = subway_start_list.length
                      var start_id = [];
                      var end_id = [];
                      for(var i = 0; i < subway_count; i++) {
                        start_id.push(station_map[subway_start_list[i]]);
                        end_id.push(station_map[subway_end_list[i]]);
                      }
                      console.log(start_id,end_id);
                      wx.request({
                        url: 'http://shanziflaskserver.com:5000/getPrice',
                        data: {
                          start_id:JSON.stringify(start_id),
                          end_id:JSON.stringify(end_id)
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'chartset': 'utf-8'
                        },
                        success: res => {
                          console.log(res.data)
                          tprice = String(res.data.totalPrice)
                          that.setData({
                            price: tprice
                          })
                        }
                      })
                    },
                    fail: function (error) {
                      console.error(error);
                    },
                  });
              }
                }) 
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
    for(let i =0; i<=9; i++){
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

  // 点击下拉框 
  bindShowMsgEndLine() {
    this.setData({
      end_line_select: !this.data.end_line_select
    })
  },

  // 已选下拉框 
  mySelectEndLine(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name 
    var find_stations = []
    for(let i =0; i<=9; i++){
        if(name == allState[i].line_name){
          find_stations = allState[i].stations;
          break;
        }
    }
    this.setData({
      end_line_name: name,
      end_line_select: false,
      end_station_name: '--选择站点--',
      stations: find_stations
    })
  },
  
    // 点击下拉框 
  bindShowMsgEndStation() {
    if(this.data.end_line_name == '--选择线路--'){
      wx.showToast({
        title: '请先选择线路！',  // 标题
        icon: 'none',   // 图标类型，默认success
        duration: 1500   // 提示窗停留时间，默认1500ms
      })
    }
    else{
      this.setData({
        end_station_select: !this.data.end_station_select
      })
    }
  },

  // 已选下拉框 
  mySelectEndStation(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name 
   
    this.setData({
      end_station_name: name,
      end_station_select: false
    })
  },

})