const tools = require('tools.js');
const settings = require('settings.js');
const api = require('api.js');
const apiFunctions = require('apiFunctions.js');
const util = require('util.js');

App({
  userInfo: {},
  domain: settings.domain,
  fileRoot: settings.fileRoot,
  tools: tools,
  settings: settings,
  api: api,
  apiFunctions: apiFunctions,
  util: util,
  Login: '0',
  request: tools.requestByLogin,

  onLaunch: function() {
    wx.hideTabBar();
  },

  onShow() {    
    const that = this;
    wx.hideTabBar();
  },

  getUerInfo() {
    const that = this;
    tools.requestByLogin({
        url: '/wx/user',
        method: 'get'
      },
      function(data) {
        that.userInfo = data;
        setTimeout(tools.todoEvent.trigger, 1000, 'userInfo');
      }
    );
  },

  globalData: {
    userId: null,
    userInfo: null,
    customerInfo: null,
    classify: null,
    format: null,
  }
});