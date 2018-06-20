// pages/attention/attention.js
let app = getApp();
const tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    columnStatus: [
      {
        id: 0,
        name: '我看过的'
      },
      {
        id: 1,
        name: '我的收藏'
      },

    ],
    status: '我看过的',
    chooseStatus: '0',  //0:我看过的   1我的收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyLikeRequire()

  },
  onTypeTap: function (e) {
    var status = e.currentTarget.dataset.status;
    console.log(status)
    if(status == '我看过的'){
      this.setData({
        chooseStatus:'0',
        status: status
      })
      this.getMyLikeRequire();
    }else{
      this.setData({
        chooseStatus: '1',
        status: status
      })
      this.getMyLikeRequire();
    }
    // this.getMyLikeRequire();
  },
  getMyLikeRequire: function (e) {
    var that = this;
    var chooseStatus = this.data.chooseStatus;
    if (chooseStatus == '1'){
      var url = `${app.api.myLikeRequire}`
    }else{
      var url = `${app.api.myVisitRequire}`
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.processPublishData(data.data)
        }
      }
    );
  },
  processPublishData: function (data) {
    // var object = data.objects;
    var objects = [];
    var temp = {};
    var find01 = [];  //我要找
    var find02 = [];  //代客找
    var out01 = [];   // 出
    var out02 = [];   //代客出
    for (var idx in data) {
      var object = data[idx].objects;
      data[idx].updatedAt = app.util.formatTime(new Date(data[idx].updatedAt));
      data[idx].createdAt = app.util.formatTime(new Date(data[idx].createdAt));
      for (var idx2 in object) {
        switch (object[idx2].type) {
          case 1:
            find01.push(object[idx2])
            break;
          case 2:
            find02.push(object[idx2])
            break;
          case 3:
            out01.push(object[idx2])
            break;
          case 4:
            out02.push(object[idx2])
            break;
          default:
            break;
        }
      }
      if (find01.length != 0) {
        temp = {
          style: '0',
          classify: '找',
          object: find01
        }
        objects.push(temp);
        find01 = [];
      }
      if (find02.length != 0) {
        temp = {
          style: '0',
          classify: '代客找',
          object: find02
        }
        objects.push(temp);
        find02 = [];
      }
      if (out01.length != 0) {
        temp = {
          style: '1',
          classify: '出',
          object: out01
        }
        objects.push(temp);
        out01 = [];
      }
      if (out02.length != 0) {
        temp = {
          style: '1',
          classify: '代客出',
          object: out02
        }
        objects.push(temp);
        out02 = [];
      }
      data[idx].objects = objects;
      objects = [];
    }
    // console.log('haha');
    // console.log(data);
    this.setData({
      publishList: data
    })
  },
  collectTea:function(e){
    var requireId = e.currentTarget.dataset.requireid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消该收藏',
      success:function(res){
        if (res.confirm) {
          console.log('用户点击确定');
          that.cancelCollect(requireId);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cancelCollect: function (e) {
    var flag = 1;
    var that = this;
    var data = {
      requireId: e
    };
    if (flag == 0) {
      var url = `${app.api.collect}`;
      var title = '收藏成功';
    } else {
      var url = `${app.api.uncollect}`;
      var title = '取消收藏';
    }
    app.apiFunctions.requestUrl(
      url,
      'POST',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          // that.processPublishData(data.data)
          wx.showToast({
            title: title,
          })
          that.getMyLikeRequire();
        }
      }
    );
  },
  onHpTap: function (e) {
    console.log('onHpTap');
    wx.redirectTo({
      url: '../homepage/homepage',
    })
  },
  onPublishTap: function (e) {
    wx.redirectTo({
      url: '../publish/publish',
    })
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