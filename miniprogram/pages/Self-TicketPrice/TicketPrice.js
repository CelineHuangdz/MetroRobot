const app = getApp()

var allState = [
  {line_name:"一号线", stations:["莘庄","外环路","莲花路","锦江乐园","上海南站","漕宝路","上海体育馆","徐家汇","衡山路","常熟路","陕西南路","黄陂南路","人民广场","新闸路","汉中路","上海火车站","中山北路","延长路","上海马戏城","汶水路","彭浦新村","共康路","通河新村","呼兰路","共富新村","宝安公路","友谊西路","富锦路"]},
  {line_name:"二号线", stations:[]},
  {line_name:"三号线", stations:[]},
  {line_name:"四号线", stations:[]},
  {line_name:"五号线", stations:[]},
  {line_name:"六号线", stations:[]},
  {line_name:"七号线", stations:[]},
  {line_name:"八号线", stations:[]},
  {line_name:"九号线", stations:[]},
  {line_name:"十号线", stations:[]},
  {line_name:"十一号线", stations:[]},
]

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
    end_station_name: '--选择站点--'
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
    this.setData({
      start_station_select: !this.data.start_station_select
    })
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

})