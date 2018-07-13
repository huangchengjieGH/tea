// pages/more/more.js
let app = getApp();
const tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var requireId = options.requireId;
    var userId = options.userId ;
    // var userId = 13
    if (requireId){
      this.setData({
        requireId: requireId
      })
      this.getPublishList(requireId);
    }
    console.log(userId);
    if (userId){
      console.log('hcj');
      this.getPublishListByUserId(userId);
    }
   
  },
  processPublishData: function(data) {
    console.log(data);
    var that = this;
    var objects = [];
    var temp = {};
    var find01 = []; //我要找
    var find02 = []; //代客找
    var out01 = []; // 出
    var out02 = []; //代客出
    var maxLength = false;

    var object = data.objects;
    data.updatedAt = app.util.formatTime(new Date(data.updatedAt));
    data.createdAt = app.util.formatTime(new Date(data.createdAt));
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
      if (object.length >= 20) {
        maxLength = true;
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
    data.objects = objects;
    that.setData({
      publishList: data
    });

    // this.setData({
    //   publishList: data
    // })
    // console.log(new Date());
  },
  getPublishList: function(requireId) {
    var that = this;
    var url = `${app.api.getPublish}` + '/' + `${requireId}`;
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      false,
      '',
      function(data) {
        console.log(data.data);
        if (data.status == 1) {

          that.processPublishData(data.data);
        }
      }
    );
  },
  getPublishListByUserId: function (userId) {
    var that = this;
    var url = `${app.api.requireUserId}`;
    var data = {
      wxUserId: userId
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      data,
      function (data) {
        console.log(data.data);
        if (data.status == 1) {

          that.processPublishData(data.data);
        }
      }
    );
  },
  onPhoneTap: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})