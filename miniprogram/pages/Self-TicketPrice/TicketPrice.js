const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key:"BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT"
});

var allState = [
  {line_name:"一号线", stations:["莘庄","外环路","莲花路","锦江乐园","上海南站","漕宝路","上海体育馆","徐家汇","衡山路","常熟路","陕西南路","黄陂南路","人民广场","新闸路","汉中路","上海火车站","中山北路","延长路","上海马戏城","汶水路","彭浦新村","共康路","通河新村","呼兰路","共富新村","宝安公路","友谊西路","富锦路"]},
  {line_name:"二号线", stations:["徐泾东","虹桥火车站","虹桥2号航站楼","淞虹路","北新泾","威宁路","娄山关路","中山公园","江苏路","静安寺","南京西路","人民广场","南京东路","陆家嘴","东昌路","世纪大道","上海科技馆","世纪公园","龙阳路","张江高科","金科路","广兰路","唐镇","创新中路","华夏东路","川沙","凌空路","远东大道","海天三路","浦东国际机场"]},
  {line_name:"三号线", stations:["上海南站","石龙路","龙漕路","漕溪路","宜山路","虹桥路","延安西路","中山公园","金沙江路","曹杨路","镇坪路","中潭路","上海火车站","宝山路","东宝兴路","虹口足球场","赤峰路","大柏树","江湾镇","殷高西路","长江南路","淞发路","张华浜","淞滨路","水产路","宝杨路","友谊路","铁力路","江杨北路"]},
  {line_name:"四号线", stations:["上海体育馆","宜山路","虹桥路","延安西路","中山公园","金沙江路","曹杨路","镇坪路","中潭路","上海火车站","宝山路","海伦路","临平路","大连路","杨树浦路","浦东大道","世纪大道","浦电路","蓝村路","塘桥","南浦大桥","西藏南路","鲁班路","大木桥路","东安路","上海体育场"]},
  {line_name:"五号线", stations:["莘庄","春申路","银都路","颛桥","北桥","剑川路","东川路","金平路","华宁路","文井路","闵行开发区"]},
  {line_name:"六号线", stations:["东方体育中心","灵岩南路","上南路","华夏西路","高青路","东明路","高科西路","临沂新村","上海儿童医学中心","蓝村路","浦电路","世纪大道","源深体育中心","民生路","北洋泾路","德平路","云山路","金桥路","博兴路","五莲路","巨峰路","东靖路","五洲大道","洲海路","外高桥保税区南站","航津路","外高桥保税区北站","港城路"]},
  {line_name:"七号线", stations:["美兰湖","罗南新村","潘广路","刘行","顾村公园","上海大学","南陈路","上大路","场中路","大场镇","行知路","大华三路","新村路","岚皋路","镇坪路","长寿路","昌平路","静安寺","常熟路","肇嘉浜路","东安路","船厂路","后滩","长清路","耀华路","云台路","高科西路","杨高南路","锦绣路","芳华路","龙阳路","花木路"]},
  {line_name:"八号线", stations:["沈杜公路","联航路","江月路","浦江镇","芦恒路","凌兆新村","东方体育中心","杨思","成山路","耀华路","中华艺术宫","西藏南路","陆家浜路","老西门","大世界","人民广场","曲阜路","中兴路","西藏北路","虹口足球场","曲阳路","四平路","鞍山新村","江浦路","黄兴路","延吉中路","黄兴公园","翔殷路","嫩江路","市光路"]},
  {line_name:"九号线", stations:["松江南站","醉白池","松江体育中心","松江新城","松江大学城","洞泾","佘山","泗泾","九亭","中春路","七宝","星中路","合川路","漕河泾开发区","桂林路","宜山路","徐家汇","肇嘉浜路","嘉善路","打浦桥","马当路","陆家浜路","小南门","商城路","世纪大道","杨高中路","芳甸路","蓝天路","台儿庄路","金桥","金吉路","金海路","顾唐路","民雷路","曹路"]},
  {line_name:"十号线", stations:["航中路","紫藤路","龙柏新村","虹桥火车站","虹桥2号航站楼","虹桥1号航站楼","上海动物园","龙溪路","水城路","伊犁路","宋园路","虹桥路","交通大学","上海图书馆","陕西南路","新天地","老西门","豫园","南京东路","天潼路","四川北路","海伦路","邮电新村","四平路","同济大学","国权路","五角场","江湾体育场","三门路","殷高东路","新江湾城","国帆路","双江路","高桥西","高桥","港城路","基隆路"]},
  {line_name:"十一号线", stations:["花桥","光明路","兆丰路","安亭","上海汽车城","昌吉东路","上海赛车场","嘉定北","嘉定西","白银路","嘉定新城","马陆","陈翔公路","南翔","桃浦新村","武威路","祁连山路","李子园","上海西站","真如","枫桥路","曹杨路","隆德路","江苏路","交通大学","徐家汇","上海游泳馆","龙华","云锦路","龙耀路","东方体育中心","三林","三林东","浦三路","御桥","罗山路","秀沿路","康新公路","迪士尼"]},
  {line_name:"十二号线", stations:["七莘路","虹莘路","顾戴路","东兰路","虹梅路","虹漕路","桂林公园","漕宝路","龙漕路","龙华","龙华中路","大木桥路","嘉善路","陕西南路","南京西路","汉中路","曲阜路","天潼路","国际客运中心","提篮桥","大连路","江浦公园","宁国路","隆昌路","爱国路","复兴岛","东陆路","巨峰路","杨高北路","金京路","申江路","金海路"]},
  {line_name:"十三号线", stations:["金运路","金沙江西路","丰庄","祁连山南路","真北路","大渡河路","金沙江路","隆德路","武宁路","长寿路","江宁路","汉中路","自然博物馆","南京西路","淮海中路","新天地","马当路","世博会博物馆","世博大道","长清路","成山路","东明路","华鹏路","下南路","北蔡","陈春路","莲溪路","华夏中路","中科路","学林路","张江路"]},
  {line_name:"十五号线", stations:["紫竹高新区","永德路","元江路","双柏路","曙建路","景西路","虹梅南路","华泾西","朱梅路","罗秀路","华东理工大学","上海南站","桂林公园","吴中路","姚虹路","红宝石路","娄山关路","长风公园","大渡河路","梅岭北路","铜川路","上海西站","武威东路","古浪路","祁安路","南大路","丰翔路","锦秋路","顾村公园"]},
  {line_name:"十六号线", stations:["龙阳路","华夏中路","罗山路","周浦东","鹤沙航城","航头东","新场","野生动物园","惠南","惠南东","书院","临港大道","滴水湖"]},
  {line_name:"十七号线", stations:["虹桥火车站","诸光路","蟠龙路","徐盈路","徐泾北城","嘉松中路","赵巷","汇金路","青浦新城","漕盈路","淀山湖大道","朱家角","东方绿舟"]},
  {line_name:"十八号线", stations:["航头","下沙","鹤涛路","沈梅路","繁荣路","周浦","康桥","御桥"]},
  {line_name:"浦江线", stations:["沈杜公路","三鲁公路","闵瑞路","浦航路","东城一路","汇臻路"]},
]

var station_map = (wx.getStorageSync('station_map') || {})
wx.setStorageSync('allState', allState)

Page({

  data: {
    start_line_select: false,
    start_station_select: false,
    start_line_name: '--选择线路--',
    start_station_name: '--选择站点--',

    lines: ['一号线', '二号线', '三号线', '四号线', '五号线', '六号线', '七号线', '八号线', '九号线', '十号线', '十一号线', '十二号线', '十三号线', '十五号线', '十六号线', '十七号线', '十八号线', '浦江线'],
    start_stations: [],
    end_stations: [],

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
      start_stations: find_stations
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
    for(let i =0; i<=18; i++){
        if(name == allState[i].line_name){
          find_stations = allState[i].stations;
          break;
        }
    }
    this.setData({
      end_line_name: name,
      end_line_select: false,
      end_station_name: '--选择站点--',
      end_stations: find_stations
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