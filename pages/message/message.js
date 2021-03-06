// pages/message/message.js
let app = getApp();
const tools = require('../../tools.js');
Page({

  data: {
    messageList:[]
  },

  onLoad: function (options) {
		wx.hideTabBar();
  },
  getMessageList: function (e) {
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.messageList,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        wx.hideLoading();
        if (data.status == 1) {
          that.setData({
            messageList:data.data
          })
        }
        that.getUnreadCount();
        // callback('success');
      }
    );
  },
  getUnreadCount: function (requireId) {
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.unreadCount,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            unReadCount: data.data
          })
        }
      }
    );
  },
  test:function(e){
   console.log('测试');
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
		wx.hideTabBar();
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    this.getMessageList();
    this.interval = setInterval(this.getMessageList, 20000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    clearInterval(that.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.interval);
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