// miniprogram/pages/MainPage-Robot/robot.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key:"BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT"
});

function writeDatabase(pro, ans){
  const db = wx.cloud.database()
  db.collection('problem-items').where({
  })
  .get({
    success: function(res) {
      console.log("查询数据库成功")
      console.log(res.data)
      if(res.data.length <= 2){
        console.log("数据库内数据不足3条，可以直接插入")
        db.collection('problem-items').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            problem: pro,
            answer: ans,
            time: new Date()
          }
        })
        .then(res => {
          console.log(res)
        }).cache(err => {
          //失败的处理
          console.log("插入失败")
        })
      }
      else{
        console.log("数据库内数据超过3条，需要更新")
        //var removeId = findOldestDataId(res.data)
        var resultTime = new Date()
        var resultId = ""
        for(let i=0; i<res.data.length;++i){
          if(res.data[i].time < resultTime){
            resultTime = res.data[i].time
            resultId = res.data[i]._id
          }
        }
        console.log(resultTime)
        console.log(resultId)
        db.collection('problem-items').doc(resultId).remove({
          success: function(res) {
            console.log("删除成功")
            console.log(res.data)
          },
          fail: err =>{
            console.log("删除失败")
            console.log(err)
          }
        })
        db.collection('problem-items').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            problem: pro,
            answer: ans,
            time: new Date()
          }
        })
        .then(res => {
          console.log(res)
        }).cache(err => {
          //失败的处理
          console.log("插入失败")
        })
      }
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询数据库失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
}

function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '欢迎使用上海地铁客服，请问有什么可以帮到您！'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

function check_station_name(name) {
  var len = name.length
  var in_name = name
  if (in_name[len-1] == '站' & in_name != '上海南站' & in_name != '虹桥火车站' & in_name != '外高桥保税区南站' & in_name != '外高桥保税区北站' & in_name != "松江南站" & in_name != "上海西站"){
    in_name = in_name.substring(0,len-1)
  }
  return in_name
}

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

var station_map = {'莘庄': '0501', '外环路': '0112', '莲花路': '0113', '锦江乐园': '0114', '上海南站': '0311', '漕宝路': '1227', '上海体育馆': '0401', '徐家汇': '1149', '衡山路': '0119', '常熟路': '0740', '陕西南路': '1233', '黄陂南路': '0122', '人民广场': '0835', '新闸路': '0124', '汉中路': '1332', '上海火车站': '0410', '中山北路': '0127', '延长路': '0128', '上海马戏城': '0129', '汶水路': '0130', '彭浦新村': '0131', '共康路': '0132', '通河新村': '0133', '呼兰路': '0134', '共富新村': '0135', '宝安公路': '0136', '友谊西路': '0137', '富锦路': '0138', '徐泾东': '0234', '虹桥火车站': '1721', '虹桥2号航站楼': '1042', '淞虹路': '0237', '北新泾': '0238', '威宁路': '0239', '娄山关路': '0240', '中山公园': '0405', '江苏路': '1147', '静安寺': '0739', '南京西路': '1334', '南京东路': '1056', '陆家嘴': '0247', '东昌路': '0248', '世纪大道': '0942', '上海科技馆': '0250', '世纪公园': '0251', '龙阳路': '1621', '张江高科': '0253', '金科路': '0254', '广兰路': '0255', '唐镇': '0256', '创新中路': '0257', '华夏东路': '0258', '川沙': '0259', '凌空路': '0260', '远东大道': '0261', '海天三路': '0262', '浦东国际机场': '0263', '石龙路': '0312', '龙漕路': '1228', '漕溪路': '0314', '宜山路': '0933', '虹桥路': '1049', '延安西路': '0404', '金沙江路': '1327', '曹杨路': '1145', '镇坪路': '0736', '中潭路': '0409', '宝山路': '0411', '东宝兴路': '0325', '虹口足球场': '0839', '赤峰路': '0327', '大柏树': '0328', '江湾镇': '0329', '殷高西路': '0330', '长江南路': '0331', '淞发路': '0332', '张华浜': '0333', '淞滨路': '0334', '水产路': '0335', '宝杨路': '0336', '友谊路': '0337', '铁力路': '0338', '江杨北路': '0339', '海伦路': '1059', '临平路': '0413', '大连路': '1240', '杨树浦路': '0415', '浦东大道': '0416', '浦电路': '0418', '蓝村路': '0630', '塘桥': '0420', '南浦大桥': '0421', '西藏南路': '0831', '鲁班路': '0423', '大木桥路': '1231', '东安路': '0742', '上海体育场': '0426', '内圈': '0427', '外圈': '0428', '内圈(宜山路)': '0429', '外圈(宜山路)': '0430', '春申路': '0502', '银都路': '0503', '颛桥': '0505', '北桥': '0507', '剑川路': '0508', '东川路': '0509', '金平路': '0510', '华宁路': '0511', '文井路': '0512', '闵行开发区': '0513', '江川路': '0531', '西渡': '0532', '萧塘': '0533', '奉浦大道': '0534', '环城东路': '0535', '望园路': '0536', '金海湖': '0537', '奉贤新城': '0538', '东方体育中心': '1154', '灵岩南路': '0622', '上南路': '0623', '华夏西路': '0624', '高青路': '0625', '东明路': '1342', '高科西路': '0748', '临沂新村 ': '0628', '上海儿童医学中心': '0629', '浦电路 ': '0631', '源深体育中心': '0633', '民生路': '0634', '北洋泾路': '0635', '德平路': '0636', '云山路': '0637', '金桥路': '0638', '博兴路': '0639', '五莲路': '0640', '巨峰路': '1247', '东靖路': '0642', '五洲大道': '0643', '洲海路': '0644', '外高桥保税区南站': '0645', '航津路': '0646', '外高桥保税区北站': '0647', '港城路': '1073', '美兰湖': '0721', '罗南新村': '0722', '潘广路': '0723', '刘行': '0724', '顾村公园': '0725', '祁华路': '0726', '上海大学': '0727', '南陈路': '0728', '上大路': '0729', '场中路': '0730', '大场镇': '0731', '行知路': '0732', '大华三路': '0733', '新村路': '0734', '岚皋路': '0735', '长寿路': '1330', '昌平路': '0738', '肇嘉浜路': '0935', '龙华中路': '1230', '后滩': '0744', '长清路': '1340', '耀华路': '0829', '云台路': '0747', '杨高南路': '0749', '锦绣路': '0750', '芳华路': '0751', '花木路': '0753', '沈杜公路': '4101', '联航路': '0821', '江月路': '0822', '浦江镇': '0823', '芦恒路': '0824', '凌兆新村': '0825', '杨思': '0827', '成山路': '1341', '中华艺术宫': '0830', '陆家浜路': '0939', '老西门': '1054', '大世界': '0834', '曲阜路': '1236', '中兴路': '0837', '西藏北路': '0838', '曲阳路': '0840', '四平路': '1061', '鞍山新村': '0842', '江浦路': '0843', '黄兴路': '0844', '延吉中路': '0845', '黄兴公园': '0846', '翔殷路': '0847', '嫩江路': '0848', '市光路': '0849', '松江南站': '0918', '醉白池': '0919', '松江体育中心': '0920', '松江新城': '0921', '松江大学城': '0922', '洞泾': '0923', '佘山': '0924', '泗泾': '0925', '九亭': '0926', '中春路': '0927', '七宝': '0928', '星中路': '0929', '合川路': '0930', '漕河泾开发区': '0931', '桂林路': '0932', '嘉善路': '1232', '打浦桥': '0937', '马当路': '1337', '小南门': '0940', '商城路': '0941', '杨高中路': '0943', '芳甸路': '0944', '蓝天路': '0945', '台儿庄路': '0946', '金桥': '0947', '金吉路': '0948', '金海路': '1251', '顾唐路': '0950', '民雷路': '0951', '曹路': '0952', '航中路': '1018', '紫藤路': '1019', '龙柏新村': '1020', '虹桥1号航站楼': '1043', '上海动物园': '1044', '龙溪路': '1045', '水城路': '1046', '伊犁路': '1047', '宋园路': '1048', '交通大学': '1148', '上海图书馆': '1051', '新天地': '1336', '豫园': '1055', '天潼路': '1237', '四川北路': '1058', '邮电新村': '1060', '同济大学': '1062', '国权路': '1063', '五角场': '1064', '江湾体育场': '1065', '三门路': '1066', '殷高东路 ': '1067', '新江湾城': '1068', '国帆路': '1069', '双江路': '1070', '高桥西': '1071', '高桥': '1072', '基隆路': '1074', '花桥': '1114', '光明路': '1115', '兆丰路': '1116', '安亭': '1117', '上海汽车城': '1118', '昌吉东路': '1119', '上海赛车场': '1120', '嘉定北': '1131', '嘉定西': '1132', '白银路': '1133', '嘉定新城': '1134', '马陆': '1135', '陈翔公路': '1136', '南翔': '1137', '桃浦新村': '1138', '武威路': '1139', '祁连山路': '1140', '李子园': '1141', '上海西站': '1142', '真如': '1143', '枫桥路': '1144', '隆德路': '1328', '上海游泳馆': '1150', '龙华': '1229', '云锦路': '1152', '龙耀路': '1153', '三林': '1155', '三林东': '1156', '浦三路': '1157', '御桥': '1828', '罗山路': '1623', '秀沿路': '1161', '康新公路': '1162', '迪士尼': '1163', '七莘路': '1220', '虹莘路': '1221', '顾戴路': '1222', '东兰路': '1223', '虹梅路': '1224', '虹漕路': '1225', '桂林公园': '1226', '国际客运中心': '1238', '提篮桥': '1239', '江浦公园': '1241', '宁国路': '1242', '隆昌路': '1243', '爱国路': '1244', '复兴岛': '1245', '东陆路': '1246', '杨高北路': '1248', '金京路': '1249', '申江路': '1250', '金运路': '1321', '金沙江西路': '1322', '丰庄': '1323', '祁连山南路': '1324', '真北路': '1325', '大渡河路': '1326', '武宁路': '1329', '江宁路': '1331', '自然博物馆': '1333', '淮海中路': '1335', '世博会博物馆': '1338', '世博大道': '1339', '华鹏路 ': '1343', '下南路': '1344', '北蔡': '1345', '陈春路 ': '1346', '莲溪路 ': '1347', '华夏中路': '1622', '中科路': '1349', '学林路 ': '1350', '张江路': '1351', '周浦东': '1624', '鹤沙航城': '1625', '航头东': '1626', '新场': '1627', '野生动物园': '1628', '惠南': '1629', '惠南东': '1630', '书院': '1631', '临港大道': '1632', '滴水湖': '1633', '诸光路': '1722', '蟠龙路': '1723', '徐盈路': '1724', '徐泾北城': '1725', '嘉松中路': '1726', '赵巷': '1727', '汇金路': '1728', '青浦新城': '1729', '漕盈路': '1730', '淀山湖大道': '1731', '朱家角': '1732', '东方绿舟': '1733', '航头': '1821', '下沙': '1822', '鹤涛路': '1823', '沈梅路': '1824', '繁荣路': '1825', '周浦': '1826', '康桥': '1827', '三鲁公路': '4102', '闵瑞路': '4103', '浦航路': '4104', '东城一路': '4105', '汇臻路"': '4106'}

wx.setStorageSync('station_map', station_map)

var illegal_item_list = ["氢气", "一氧化碳", "甲烷", "乙烷", "丁烷", "天然气", "乙烯", "丙烯", "乙炔", "液化石油气", "氧气", "煤气", "汽油", "煤油", "柴油", "苯", "乙醇", "酒精", "丙酮", "乙醚", "油漆", "稀料", "松香油", "红磷", "闪光粉", "固体酒精", "赛璐珞", "黄磷", "白磷", "硝化纤维片", "油纸", "金属钾", "钠", "锂", "碳化钙", "电石", "镁铝粉", "高锰酸钾", "氯酸钾", "过氧化钠", "过氧化钾", "过氧化铅", "过醋酸", "双氧水", "炮弹", "子弹", "炸药", "雷管", "导火索", "导爆索", "鞭炮", "爆竹", "礼花弹", "烟花", "氰化物", "汞", "水银", "农药", "硒粉", "苯酚", "生漆", "放射性同位素", "盐酸", "硫酸", "硝酸", "氢氧化钠", "氢氧化钾", "蓄电池", "氢氧化钾固体", "碱液", "手枪", "步枪", "冲锋枪", "机枪", "防暴枪", "气枪", "猎枪", "运动枪", "麻醉注射枪", "样品枪", "道具枪", "发令枪", "仿真枪", "军械", "警械", "警棍", "弓弩", "匕首", "三棱刀", "三棱刮刀", "弹簧刀单刃", "双刃", "三棱刀等", "陶瓷刀"]

var old_label = 999
var old_entity_list = {"LOC": [], "FAC": [], "LIN": [], "SEC": [], "RUL": [], "TIC": [], "SUR": []}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    priceInfo: [],
    priceList : [],
    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
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
    //writeDatabase("pro-test", "ans-test")
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
      url: 'http://shanziflaskserver.com:5000/sendQA',
      //url: 'http://127.0.0.1:5000/sendQA',
      data: {
        question:JSON.stringify(e.detail.value),
        old_label:old_label,
        old_entity_list:JSON.stringify(old_entity_list),
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      success: res => {
        var { label, entity_list} = res.data
        if (typeof label == undefined || typeof entity_list == undefined){
          label = old_label
          entity_list = old_entity_list
        }
        //console.log(res.data)
        console.log(label, entity_list)
        old_label = label
        old_entity_list = entity_list
        var send_msg_field = this
        if(label == '2'){
          if(entity_list.LOC.length<1)
          {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '如需路径规划，输入的问题应至少包括终点哦'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
          else if(entity_list.LOC.length<2)
          {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '未检测到起点，以使用目前位置作为启动'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
            wx.getLocation({
              type: 'wgs84',
              success (res) {
                console.log(res)
                const start_latitude = res.latitude
                const start_longitude = res.longitude
                console.log("start_lo:", start_longitude)
                console.log("start_la", start_latitude)
                wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
                url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
                method:'GET',
                data:{
                  address:entity_list.LOC[0]
                },
                success: res => { 
                  const geocodes1 = res.data.geocodes[0]['location']
                  //console.log(geocodes1)
                  var a = geocodes1.split(',')
                  var data3=parseFloat(a[0])
                  console.log("terminal_lo:", data3)
                  var data4=parseFloat(a[1])
                  console.log("terminal_la", data4)
                  let plugin = requirePlugin('routePlan');
                  let key = 'BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT';  //使用在腾讯位置服务申请的key
                  let referer = 'Metro智能客服';   //调用插件的app的名称
                  let startPoint = JSON.stringify({  //起点
                    'name': "当前位置",
                    'latitude': start_latitude,
                    'longitude': start_longitude
                  });
                  let endPoint = JSON.stringify({  //终点
                  'name': entity_list.LOC[0],
                  'latitude': data4,
                  'longitude': data3
                  });
                  wx.navigateTo({
                      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&startPoint='+startPoint+'&endPoint=' + endPoint
                  });
                }
              }) 
              }
            });
          }
          else{
          wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
            url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
            method:'GET',
            data:{
              address:entity_list.LOC[0]
            },
            success: res => { 
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
                address:entity_list.LOC[1]
            },
                success: res => { 
                const geocodes2 = res.data.geocodes[0]['location']
                console.log(geocodes2)
                var b = geocodes2.split(',')
                var data3=parseFloat(b[0])
                console.log(data3)
                var data4=parseFloat(b[1])
                console.log(data4)
                let plugin = requirePlugin('routePlan');
                let key = 'BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT';  //使用在腾讯位置服务申请的key
                let referer = 'Metro智能客服';   //调用插件的app的名称
                let startPoint = JSON.stringify({  //起点
                  'name': entity_list.LOC[0],
                  'latitude': data2,
                  'longitude': data1
                });
                let endPoint = JSON.stringify({  //终点
                'name': entity_list.LOC[1],
                'latitude': data4,
                'longitude': data3
              });
              wx.navigateTo({
                  url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&startPoint='+startPoint+'&endPoint=' + endPoint
              });
            }
              }) 
            }
          })
          }
        }
        else if(label == '5'){
          if(entity_list.LOC.length<1)
          {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '如需查询票价哦，输入的问题应至少包括终点哦'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
          else if(entity_list.LOC.length<2)
          {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '未检测到起点，以使用目前位置作为起点'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
            wx.getLocation({
              type: 'gcj02',
              success (res) {
                console.log(res)
                const start_latitude = res.latitude
                const start_longitude = res.longitude
                console.log("start_lo:", start_longitude)
                console.log("start_la", start_latitude)
                wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
                url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
                method:'GET',
                data:{
                  address:entity_list.LOC[0]
                },
                success: res => { 
                  const geocodes1 = res.data.geocodes[0]['location']
                  //console.log(geocodes1)
                  var a = geocodes1.split(',')
                  var data3=parseFloat(a[0])
                  console.log("terminal_lo:", data3)
                  var data4=parseFloat(a[1])
                  console.log("terminal_la", data4)

                  var start_latitude_s = String(start_latitude);
                  var start_longitude_s = String(start_longitude);
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
                          console.log(res);
                          var content = "最快路线中，轨道交通路段的价格为：" + String(res.data.totalPrice) + "元"
                          writeDatabase(e.detail.value, content)
                          msgList.push({
                            speaker: 'server',
                            contentType: 'text',
                            content: content
                          })
                          inputVal = '';
                          send_msg_field.setData({
                            msgList,
                            inputVal
                          });
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
            });
          }

          else{
            wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
              url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
              method:'GET',
              data:{
                address:entity_list.LOC[0]
              },
              success: res => { 
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
                  address:entity_list.LOC[1]
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
                          console.log(res.data);
                          var content = "最快路线中，轨道交通路段的价格为：" + String(res.data.totalPrice) + "元"
                          writeDatabase(e.detail.value, content)
                          msgList.push({
                            speaker: 'server',
                            contentType: 'text',
                            content: content
                          })
                          inputVal = '';
                          send_msg_field.setData({
                            msgList,
                            inputVal,
                            toView: 'msg-' + (msgList.length - 1)
                          });
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
        }
        else if(label == '6'){
          console.log (entity_list.LOC)
          if (entity_list.LOC.length < 1){
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '如需查询首末班车时间，要输入站点名称哦'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
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
                var station_clean = check_station_name(entity_list.LOC[0]) 
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
                              if (entity_list.LIN.length > 0){
                                var line_name = entity_list.LIN[0]
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
                                  content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
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
                      writeDatabase(e.detail.value, content)
                      msgList.push({
                        speaker: 'server',
                        contentType: 'text',
                        content: content
                      })
                      this.setData({
                        msgList,
                        inputVal,
                        toView: 'msg-' + (msgList.length - 1)
                      });
                    }
                  })
                }
              }
            })
          }   
        }
        else if(label == '3'){
          if(entity_list.LOC.length<1)
          {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '正在查询离您所在位置最近的地铁站中的设施'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
            wx.getLocation({
              type: 'wgs84',
              success (res) {
                console.log(res)
                const location_latitude = res.latitude
                const location_longitude = res.longitude
                console.log("loc_lo:", location_latitude)
                console.log("loc_la", location_longitude)
                wx.request({//高德api搜周边
                  url: "https://restapi.amap.com/v3/place/around?key=7c49a0d0aecc88700c180e1c048f8e3c" + "&location=" + String(location_longitude) + "," + String(location_latitude) + "&radius=1000&keywords=" + "地铁站" + "&city=上海&output=JSON",
                  method:'GET',
                  success:res=>{
                    console.log(res)
                    if(res.data.pois.length < 1){
                      msgList.push({
                        speaker: 'server',
                        contentType: 'text',
                        content: '未查询到您周边1KM内的站点'
                      })
                      send_msg_field.setData({
                        msgList,
                        inputVal,
                        toView: 'msg-' + (msgList.length - 1)
                      });
                    }
                    else{
                      var test = res.data.pois[0].name
                      var name = ""
                      for(var i=0; i < test.length; i++) {
                        if (test[i] != "("){
                          name = name + test[i]
                        }
                        else{
                          break;
                        }
                      }
                      console.log(name)
                      var station_code = station_map[name]
                      if (typeof(station_code) == "undefined"){
                        msgList.push({
                          speaker: 'server',
                          contentType: 'text',
                          content: '未查询到您周边1KM内的站点'
                        })
                        send_msg_field.setData({
                          msgList,
                          inputVal,
                          toView: 'msg-' + (msgList.length - 1)
                        });
                      }
                      else{
                        wx.request({//高德api搜周边
                          url: "http://m.shmetro.com/interface/metromap/metromap.aspx?func=stationInfo" + "&stat_id=" + station_code,
                          method:'GET',
                          success:res=>{
                            console.log(res)
                            var content_this = ""
                            var toilet_str = String(res.data[0].toilet_position)
                            toilet_str = toilet_str.replace(/\'/g,"\"")
                            var elevator_str = res.data[0].elevator
                            elevator_str = elevator_str.replace(/\'/g,"\"")
                            elevator_str = elevator_str
                            var toilet_pos = JSON.parse(toilet_str)
                            console.log(toilet_pos)
                            var elevator = JSON.parse(elevator_str)
                            console.log(elevator)
                            for(var i = 0; i < toilet_pos.toilet.length; i++){
                              content_this = content_this + String(toilet_pos.toilet[i].lineno) + "号线洗手间：" + toilet_pos.toilet[i].description + "\n "
                            }
                            content_this = content_this + "\n "
                            for(var i = 0; i < elevator.line.length; i++){
                              content_this = content_this + String(elevator.line[i].lineno) + "号线无障碍电梯：" + "\n "
                              for(var j = 0; j< elevator.line[i].elevator.length; j++){
                                content_this = content_this + elevator.line[i].elevator[j].description + "\n "
                              }
                              content_this = content_this + "\n "
                            }
                            writeDatabase(e.detail.value, content_this)
                            msgList.push({
                              speaker: 'server',
                              contentType: 'text',
                              content: content_this
                            })
                            send_msg_field.setData({
                              msgList,
                              inputVal,
                              toView: 'msg-' + (msgList.length - 1)
                            });
                          }
                        })
                      }
                    }
                  }
                })
              }
            })
          }
          else{
            var name = entity_list.LOC[0]
            name = check_station_name(name)
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
                    msgList.push({
                      speaker: 'server',
                      contentType: 'text',
                      content: '未查询到您周边1KM内的站点'
                    })
                    send_msg_field.setData({
                      msgList,
                      inputVal,
                      toView: 'msg-' + (msgList.length - 1)
                    });
                  }
                  else{
                    wx.request({//高德api搜周边
                      url: "http://m.shmetro.com/interface/metromap/metromap.aspx?func=stationInfo" + "&stat_id=" + station_code,
                      method:'GET',
                      success:res=>{
                        console.log(res)
                        var content_this = ""
                        var toilet_str = String(res.data[0].toilet_position)
                        toilet_str = toilet_str.replace(/\'/g,"\"")
                        var elevator_str = res.data[0].elevator
                        elevator_str = elevator_str.replace(/\'/g,"\"")
                        elevator_str = elevator_str
                        var toilet_pos = JSON.parse(toilet_str)
                        console.log(toilet_pos)
                        var elevator = JSON.parse(elevator_str)
                        console.log(elevator)
                        for(var i = 0; i < toilet_pos.toilet.length; i++){
                          content_this = content_this + String(toilet_pos.toilet[i].lineno) + "号线洗手间：" + toilet_pos.toilet[i].description + "\n "
                        }
                        content_this = content_this + "\n "
                        for(var i = 0; i < elevator.line.length; i++){
                          content_this = content_this + String(elevator.line[i].lineno) + "号线无障碍电梯：" + "\n "
                          for(var j = 0; j< elevator.line[i].elevator.length; j++){
                            content_this = content_this + elevator.line[i].elevator[j].description + "\n "
                          }
                          content_this = content_this + "\n "
                        }
                        msgList.push({
                          speaker: 'server',
                          contentType: 'text',
                          content: content_this
                        })
                        send_msg_field.setData({
                          msgList,
                          inputVal,
                          toView: 'msg-' + (msgList.length - 1)
                        });
                      }
                    })
                  }
                }
              })
            }
            else{
              wx.request({//高德api搜周边
                url: "http://m.shmetro.com/interface/metromap/metromap.aspx?func=stationInfo" + "&stat_id=" + station_code,
                method:'GET',
                success:res=>{
                  console.log(res)
                  var content_this = ""
                  var toilet_str = String(res.data[0].toilet_position)
                  toilet_str = toilet_str.replace(/\'/g,"\"")
                  var elevator_str = res.data[0].elevator
                  elevator_str = elevator_str.replace(/\'/g,"\"")
                  elevator_str = elevator_str
                  var toilet_pos = JSON.parse(toilet_str)
                  console.log(toilet_pos)
                  var elevator = JSON.parse(elevator_str)
                  console.log(elevator)
                  for(var i = 0; i < toilet_pos.toilet.length; i++){
                    content_this = content_this + String(toilet_pos.toilet[i].lineno) + "号线洗手间：" + toilet_pos.toilet[i].description + "\n "
                  }
                  content_this = content_this + "\n "
                  for(var i = 0; i < elevator.line.length; i++){
                    content_this = content_this + String(elevator.line[i].lineno) + "号线无障碍电梯：" + "\n "
                    for(var j = 0; j< elevator.line[i].elevator.length; j++){
                      content_this = content_this + elevator.line[i].elevator[j].description + "\n "
                    }
                    content_this = content_this + "\n "
                  }
                  msgList.push({
                    speaker: 'server',
                    contentType: 'text',
                    content: content_this
                  })
                  send_msg_field.setData({
                    msgList,
                    inputVal,
                    toView: 'msg-' + (msgList.length - 1)
                  });
                }
              })
            }                    
          }
        }
        else if(label == '0'){
          if(entity_list.LOC.length < 1){
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '如需查询客流量，输入的问题应至少包括查询的站点哦'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
          else{
            var name = entity_list.LOC[0]
            name = check_station_name(name)
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
                    msgList.push({
                      speaker: 'server',
                      contentType: 'text',
                      content: '未查询到您输入的站点'
                    })
                    send_msg_field.setData({
                      msgList,
                      inputVal,
                      toView: 'msg-' + (msgList.length - 1)
                    });
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
                        else if (entity_list.LIN.length > 0){
                          var lin_name = entity_list.LIN[0]
                          var flag = 0
                          for (var i = 0; i < res.data.train_name.length; i++){
                            if (res.data.train_name[i] == lin_name){
                              flag = 1
                              content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                            content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                            }
                          }
                          if(flag == 0){
                            content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
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
                        writeDatabase(e.detail.value, content)
                        msgList.push({
                          speaker: 'server',
                          contentType: 'text',
                          content: content
                        })
                        send_msg_field.setData({
                          msgList,
                          inputVal,
                          toView: 'msg-' + (msgList.length - 1)
                        });
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
                  else if (entity_list.LIN.length > 0){
                    var lin_name = entity_list.LIN[0]
                    var flag = 0
                    for (var i = 0; i < res.data.train_name.length; i++){
                      if (res.data.train_name[i] == lin_name){
                        flag = 1
                        content = content + res.data.train_name[i] + res.data.end_station[i] + "方向的载客率为" + res.data.load_ratio_down[i] + "\n "
                      content = content + res.data.train_name[i] + res.data.start_station[i] + "方向的载客率为" + res.data.load_ratio_up[i] + "\n "
                      }
                    }
                    if(flag == 0){
                      content = "输入线路站点不匹配，已采用查询站点的默认输出\n "
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
                  writeDatabase(e.detail.value, content)
                  msgList.push({
                    speaker: 'server',
                    contentType: 'text',
                    content: content
                  })
                  send_msg_field.setData({
                    msgList,
                    inputVal,
                    toView: 'msg-' + (msgList.length - 1)
                  });
                }
              })
            }
          }
        }
        else if(label == '4'){
          if (entity_list.SUR.length < 1) {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: "若要查询周边设施，请至少输入周边设施的名称"
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
          else{
            if(entity_list.LOC.length<1){
              msgList.push({
                speaker: 'server',
                contentType: 'text',
                content: '正在查询您所在位置附近的' + entity_list.SUR[0]
              })
              this.setData({
                msgList,
                inputVal,
                toView: 'msg-' + (msgList.length - 1)
              });
              wx.getLocation({
                type: 'wgs84',
                success (res) {
                  console.log(res)
                  const location_latitude = res.latitude
                  const location_longitude = res.longitude
                  console.log("loc_lo:", location_latitude)
                  console.log("loc_la", location_longitude)
                  wx.request({//高德api搜周边
                    url: "https://restapi.amap.com/v3/place/around?key=7c49a0d0aecc88700c180e1c048f8e3c" + "&location=" + String(location_longitude) + "," + String(location_latitude) + "&radius=1000&keywords=" + entity_list.SUR[0] + "&city=上海&output=JSON",
                    method:'GET',
                    success:res=>{
                      console.log(res)
                      if(res.data.pois.length < 1){
                        msgList.push({
                          speaker: 'server',
                          contentType: 'text',
                          content: '未在您您周边1KM内查询到该周边设施'
                        })
                        send_msg_field.setData({
                          msgList,
                          inputVal,
                          toView: 'msg-' + (msgList.length - 1)
                        });
                      }
                      else{
                        var test = res.data.pois[0].name
                        var name = ""
                        for(var i=0; i < test.length; i++) {
                          if (test[i] != "("){
                            name = name + test[i]
                          }
                          else{
                            break;
                          }
                        }
                        console.log(name)
                        var lo_la = res.data.pois[0].location
                        var lo = ""
                        var la = ""
                        var flag = 0
                        for (var i = 0; i < lo_la.length; i++){
                          if(lo_la[i] == ","){
                            flag = 1
                          }
                          else if(flag == 0){
                            lo = lo + lo_la [i]
                          }
                          else if(flag == 1){
                            la = la + lo_la [i]
                          }
                        }
                        console.log(lo,la)
                        let plugin = requirePlugin('routePlan');
                        let key = 'BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT';  //使用在腾讯位置服务申请的key
                        let referer = 'Metro智能客服';   //调用插件的app的名称
                        let startPoint = JSON.stringify({  //起点
                          'name': "当前位置",
                          'latitude': location_latitude,
                          'longitude': location_longitude
                        });
                        let endPoint = JSON.stringify({  //终点
                        'name': name,
                        'latitude': la,
                        'longitude': lo
                        });
                        console.log(startPoint)
                        console.log(endPoint)
                        wx.navigateTo({
                          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&startPoint='+startPoint+'&endPoint=' + endPoint
                        });
                      }
                    }
                  })
                }
              })
            }
            else{
              wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
                url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
                method:'GET',
                data:{
                  address:entity_list.LOC[0]
                },
                success: res => {
                  const geocodes1 = res.data.geocodes[0]['location']
                  //console.log(geocodes1)
                  var a = geocodes1.split(',')
                  var data1=parseFloat(a[0])
                  console.log("start_lo:", data1)
                  var data2=parseFloat(a[1])
                  console.log("start_la", data2)

                  wx.request({//高德api搜周边
                    url: "https://restapi.amap.com/v3/place/around?key=7c49a0d0aecc88700c180e1c048f8e3c" + "&location=" + String(data1) + "," + String(data2) + "&radius=1000&keywords=" + entity_list.SUR[0] + "&city=上海&output=JSON",
                    method:'GET',
                    success:res=>{
                      console.log(res)
                      if(res.data.pois.length < 1){
                        msgList.push({
                          speaker: 'server',
                          contentType: 'text',
                          content: '未在指定地点1KM内查询到该周边设施'
                        })
                        send_msg_field.setData({
                          msgList,
                          inputVal,
                          toView: 'msg-' + (msgList.length - 1)
                        });
                      }
                      else{
                        var test = res.data.pois[0].name
                        var name = ""
                        for(var i=0; i < test.length; i++) {
                          if (test[i] != "("){
                            name = name + test[i]
                          }
                          else{
                            break;
                          }
                        }
                        console.log(name)

                        var lo_la = res.data.pois[0].location
                        var lo = ""
                        var la = ""
                        var flag = 0
                        for (var i = 0; i < lo_la.length; i++){
                          if(lo_la[i] == ","){
                            flag = 1
                          }
                          else if(flag == 0){
                            lo = lo + lo_la [i]
                          }
                          else if(flag == 1){
                            la = la + lo_la [i]
                          }
                        }
                        console.log(lo,la)
                        let plugin = requirePlugin('routePlan');
                        let key = 'BGOBZ-TNJCU-CXOVW-4CPDA-AZROZ-FIBLT';  //使用在腾讯位置服务申请的key
                        let referer = 'Metro智能客服';   //调用插件的app的名称
                        let startPoint = JSON.stringify({  //起点
                          'name': entity_list.LOC[0],
                          'latitude': data2,
                          'longitude': data1
                        });
                        let endPoint = JSON.stringify({  //终点
                        'name': name,
                        'latitude': la,
                        'longitude': lo
                        });
                        console.log(startPoint)
                        console.log(endPoint)
                        wx.navigateTo({
                          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&startPoint='+startPoint+'&endPoint=' + endPoint
                        });
                       
                      }
                    }
                  })
                  
                }
              })
            }
          }
        }
        else if(label == '1'){
          if (entity_list.LOC.length < 1){
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '未检测到起点，以使用目前位置作为查询参数'
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
            wx.getLocation({
              type: 'gcj02',
              success (res) {
                console.log(res)
                const start_latitude = res.latitude
                const start_longitude = res.longitude
                console.log("start_lo:", start_longitude)
                console.log("start_la", start_latitude)
                var location_lola = "" + String(start_longitude) + "," + String(start_latitude)
                wx.request({
                  url: "https://devapi.heweather.net/v7/weather/now?location="+location_lola+"&output=JSON&key=abee02bd328f4082bed7755afb552635",
                  method:'GET',
                  data:{
                     location:location_lola
                   },
                  success:res=>{
                    console.log(res)
                    var content_this = "当前地点" + '的经纬度：'+location_lola+' \n 该地点天气情况如下：\n '+' 天气状况：'+res.data.now.text+' \n 当前温度：'+res.data.now.temp+'℃ \n 体感温度：'+res.data.now.feelsLike+'℃ \n 相对湿度：'+res.data.now.humidity+'% \n 风向：'+res.data.now.windDir+' \n 能见度：'+res.data.now.vis+'m'
                    writeDatabase(e.detail.value, content_this)
                    msgList.push({
                      speaker: 'server',
                      contentType: 'text',
                      content: content_this
                    })
                    send_msg_field.setData({
                      msgList,
                      inputVal,
                      toView: 'msg-' + (msgList.length - 1)
                    });
                  }
                })
              }
            })
          }
          else{
            wx.request({//调用高德地图api返回经纬度geocodes[0]["location"]
                url: 'https://restapi.amap.com/v3/geocode/geo?city=上海&output=JSON&key=7c49a0d0aecc88700c180e1c048f8e3c',
                method:'GET',
                data:{
                  address:entity_list.LOC[0]
                },
                success: res => {
                  const location_lola = res.data.geocodes[0]['location']
                  wx.request({
                    url: "https://devapi.heweather.net/v7/weather/now?location="+location_lola+"&output=JSON&key=abee02bd328f4082bed7755afb552635",
                    method:'GET',
                    data:{
                       location:location_lola
                     },
                    success:res=>{
                      console.log(res)
                      msgList.push({
                        speaker: 'server',
                        contentType: 'text',
                        content:entity_list.LOC[0] + '的经纬度：'+location_lola+' \n 该地点天气情况如下：\n '+' 天气状况：'+res.data.now.text+' \n 当前温度：'+res.data.now.temp+'℃ \n 体感温度：'+res.data.now.feelsLike+'℃ \n 相对湿度：'+res.data.now.humidity+'% \n 风向：'+res.data.now.windDir+' \n 能见度：'+res.data.now.vis+'m' })
                      send_msg_field.setData({
                        msgList,
                        inputVal,
                        toView: 'msg-' + (msgList.length - 1)
                      });
                    }
                  })
                }
            })
          }
        }
        else if(label == '7'){
          if (entity_list.SEC.length < 1){
            let content = '禁止乘客携带易燃、易爆、有毒、有放射性、有腐蚀性以及其他有可能危及人身和财产安全的危险物品进站、乘车。\\n 为便于乘客反映轨交安检问题，可拨打地铁热线：64370000。';
            msgList.push({
            speaker: 'server',
            contentType: 'text',
            content: content
            })
            this.setData({
            msgList,
            inputVal,
            toView: 'msg-' + (msgList.length - 1)
            });
          }
          else{
            var sec_item = entity_list.SEC
            console.log(sec_item)
            var content = ""
            for ( var i = 0; i < sec_item.length; i++){
              if (illegal_item_list.includes(sec_item[i])){
                content = content + sec_item[i] + "是违禁品\n"
              }
              else {
                content = content + sec_item[i] + "可以携带入内\n"
              }
            }
            writeDatabase(e.detail.value, content)
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: content
            })
            this.setData({
              msgList,
              inputVal,
              toView: 'msg-' + (msgList.length - 1)
            });
          }
        }
        else if(label == '999'){
          msgList.push({
            speaker: 'server',
            contentType: 'text',
            content: "程序出错"
          })
          this.setData({
            msgList,
            inputVal,
            toView: 'msg-' + (msgList.length - 1)
          });
        }
      }
    })

  },

  toBackClick: function() {
    wx.navigateBack({})
  }

})