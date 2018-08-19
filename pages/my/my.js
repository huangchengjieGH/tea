let app = getApp();
const tools = require('../../tools.js');
const Ajax = require('../../ajaxMethods/ajax.js');

Page({
  data: {
    teaList: [],
    visit: 0,
    attention: 1,
    unReadCount: 0,
    customer: {}
  },

  onLoad: function(options) {
    wx.hideTabBar();
    this.getPublish();
    this.getCustomer();
  },

  getCustomer() {
    const that = this;
    Ajax.prototype.getCustomer().then(res => {
      that.setData({
        customer: res.data
      });
    });
  },

  getPublish: function(e) {
    var url = `${app.api.getPublish}` + '/' + `${this.data.userId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.myPublish,
      'GET',
      true,
      true,
      '',
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            teaList: data.data[0]
          })
        }
      }
    );
  },

  getUnreadCount: function(requireId) {
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.unreadCount,
      'GET',
      true,
      true,
      '',
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            unReadCount: data.data
          })
        }
      }
    );
  },

  onShow: function() {
    wx.hideTabBar();
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 20000);
  },


  onHide: function() {
    var that = this;
    clearInterval(that.interval);
  },


  onUnload: function() {
    var that = this;
    clearInterval(that.interval);
  }

});