//Self-Check.js
const app = getApp()
var buttonList = [];

function initData(that) {
  buttonList = [{
      id:0,
      btnImage: '../../images/server.png',
      btnText: '按钮1'
    },
    {
      id:1,
      btnImage: '../../images/server.png',
      btnText: '按钮2'
    },
    {
      id:2,
      btnImage: '../../images/server.png',
      btnText: '按钮3'
    },
    {
      id:3,
      btnImage: '../../images/server.png',
      btnText: '按钮4'
    },
    {
      id:4,
      btnImage: '../../images/server.png',
      btnText: '按钮5'
    },
    {
      id:5,
      btnImage: '../../images/server.png',
      btnText: '按钮6'
    },
    {
      id:6,
      btnImage: '../../images/server.png',
      btnText: '按钮7'
    },
    {
      id:7,
      btnImage: '../../images/server.png',
      btnText: '按钮8'
    }
  ]
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


})