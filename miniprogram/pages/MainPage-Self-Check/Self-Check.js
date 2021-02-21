//Self-Check.js
const app = getApp()

var buttonList = new Array(); 
buttonList["首末班车"] = "First_Last-Train";
buttonList["票务票价"] = "TicketPrice";
buttonList["客流情况"] = "PassengerFlow";
buttonList["天气预报"] = "Weather";
buttonList["路线规划"] = "Path_Planning";
buttonList["周边查询"] = "Around";
buttonList["公共设施"] = "Public_Facilities";
buttonList["规章制度"] = "Regulations";

Page({
  data: {
    text: "【公告】已实现功能：需要服务器[客流情况，票务票价，首末班车，智能客服]，不需要服务器[天气预报，路线规划，周边查询，公共设施，规章制度]；待实现功能：猜你想问",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 50,
    size:14,
    interval: 30, // 时间间隔
    problem_items: [],
    logged: false,
    takeSession: false,
    requestResult: '',
    isShow:false
  },

  onLoad: function(options) {
    
  },

  onShow: function(){
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度

    const db = wx.cloud.database()
    db.collection('problem-items').where({
    })
    .get({
      success: function(res) {
        console.log("查询数据库成功")
        console.log(res.data)
        that.setData({
          length: length,
          windowWidth: windowWidth,
          problem_items: res.data
        });
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询数据库失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    //console.log(new Date());
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    that.scrolltxt();// 第一个字消失后立即从右边出现
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth){
     var interval = setInterval(function () {
     var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
     var crentleft = that.data.marqueeDistance;
     if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
      that.setData({
      marqueeDistance: crentleft + that.data.marqueePace
      })
     }
     else {
      //console.log("替换");
      that.setData({
        marqueeDistance: 0,
      });
      clearInterval(interval);
      that.scrolltxt();
     }
     }, that.data.interval);
    }
    else{
     that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
    },

  gotoPage: function(e){
    const text = e.currentTarget.dataset.text;
    console.log(text);
    const url = "../Self-" + buttonList[text] + "/" + buttonList[text];//得到页面url 
    wx.navigateTo({
      url: url, 
    })
  },

  toastShow:function(str){
    var _this = this;
    _this.setData({
        isShow: true,
        txt: str
    });
    setTimeout(function () {    //toast消失
        _this.setData({
            isShow: false
        });
    }, 2000);  
},

  answerProblem: function(e){
    var problemSelect = e.currentTarget.dataset.name
    var answerSelect = e.currentTarget.dataset.ans
    console.log(problemSelect)
    console.log(answerSelect)
    this.toastShow(answerSelect);
  }

})