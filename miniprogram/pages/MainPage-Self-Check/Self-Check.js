//Self-Check.js
const app = getApp()
var buttonList = new Array(); 
buttonList["首末班车"] = "First_Last-Train";
buttonList["票务票价"] = "TicketPrice";

function initData(that) {
  
}

Page({
  data: {
    avatarUrl: '../../images/metro.jpg',
    problem_items: [
      {
        id:0,
        problem_name:"问题1",
        pages:[]
      },
      {
        id:1,
        problem_name:"问题2",
        pages:[]
      },
      {
        id:2,
        problem_name:"问题3",
        pages:[]
      }
    ],
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function(options) {
    initData(this);
  },

  gotoPage: function(e){
    const text = e.currentTarget.dataset.text;
    console.log(text);
    const url = "../Self-" + buttonList[text] + "/" + buttonList[text];//得到页面url 
    wx.navigateTo({
      url: url, 
    })
  }


})