// pages/chat/chat.js
let app = getApp();
const tools = require('../../tools.js');
var page = 1;
var page_size = 7;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatList:[],
    messageList:[],
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var ortherUserId = options.ortherUserId;
    this.getOnlineMessage(id,ortherUserId);
    this.getMyMsg();
  },
  getOnlineMessage: function (id, ortherUserId){
    /***私信列表进来 */
    if (id) {
      page = 1;
      this.setData({
        messageList: []
      })
      this.getMessage(id);
    }
    /***首页进来*/
    if (ortherUserId) {
      this.setData({
        ortherUserId: ortherUserId,
        messageList: []
      })
      page = 1;
      this.setMessageReaded(ortherUserId);
      this.getMessageByOrtherUserId(ortherUserId);
    }
  },
  messageInput: function(e) {
    console.log('发送');
    console.log(e.detail.value)
    var msg = e.detail.value;
    if (this.data.myMsg.nickName!= null){
      if (msg) {
        var otherId = this.data.ortherUserId;
        this.sendMessage(otherId, msg);
        this.processSendMessageData(this.data.msg);
      } else {
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请先获取用户信息才可以进行私信',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }   
  },
  bindblurInput:function(e){
    var msg = e.detail.value;
    console.log(msg);
    if (msg){
      this.setData({
        msg: msg
      })
    }
  },
  onSendTap:function(e){
    if (this.data.myMsg.nickName != null) {
      if (this.data.msg!='') {
        var otherId = this.data.ortherUserId;
        this.sendMessage(otherId, this.data.msg);
        this.processSendMessageData(this.data.msg);
      } else {
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先获取用户信息才可以进行私信',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }  
  },
  processSendMessageData:function(msg){
    var createdAt = app.util.formatTime(new Date());
    var messageList = this.data.messageList;
    var temp ={
      id: messageList[0].id+1,
      status: messageList[0].status,
      createdAt: createdAt,
      updatedAt: messageList[0].updatedAt,
      msg: msg,
      chatId: messageList[0].chatId,
      mine:true,
      flag: messageList[0].flag
    };
    messageList = this.prepend(messageList, temp);
    this.setData({
      messageList: messageList
    })
  },
  getMessage: function(id) {
    var that = this;
    var url = `${app.api.message}` + '/' + `${id}`;
    var data = {
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      data,
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            ortherUserId: data.data.other.id
          })
          page++;
          that.setMessageReaded(data.data.other.id);
          that.processMessageData(data.data);
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      }
    );
  },
  getMessageByOrtherUserId: function (ortherId) {
    var that = this;
    var url = `${app.api.message}`;
    var data = {
      othersWxUserId: ortherId,
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            ortherUserId: data.data.other.id
          })
          page++;
          that.setMessageReaded(data.data.other.id);
          that.processMessageData(data.data);
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      }
    );
  },
  getUnreadMessage:function(e){
    var that = this;
    var url = `${app.api.unreadMessage}`;
    var data={
      othersWxUserId: that.data.ortherUserId
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          if(data.data.length > 0){
            // that.setData({
            //   ortherUserId: data.data.other.id
            // })
            // that.setMessageReaded(data.data.other.id);
            that.processUnreadMessageData(data.data);
          }         
        }
      }
    );
  },
  processMessageData: function(data) {
    var that = this;
    var index = 0;
    var length = data.messages.length;
    console.log(length);
    for (var idx in data.messages) {
      var timeGap = 0;
      if (idx != length - 1) {
        timeGap = data.messages[index].updatedAt - data.messages[idx].updatedAt;
        timeGap = timeGap/1000/60;
        // console.log(timeGap)
        if (timeGap > 30) {
          data.messages[idx].flag = true;
          index = idx;
        } else {
          data.messages[idx].flag = false;
        }
      }
      data.messages[idx].createdAt = app.util.formatTime(new Date(data.messages[idx].createdAt));
    }
    
    var messageList = that.data.messageList;
    for (var i in data.messages) {
      messageList.push(data.messages[i]);
    }
    that.setData({
      chatList: data,
      messageList: messageList
    });
  },
  processUnreadMessageData: function (data) {
    var that = this;
    var index = 0;
    var length = data.length;
    console.log(length);
    for (var idx in data) {
      var timeGap = 0;
      if (idx != length - 1) {
        timeGap = data[index].updatedAt - data[idx].updatedAt;
        timeGap = timeGap / 1000 / 60;
        // console.log(timeGap)
        if (timeGap > 30) {
          data[idx].flag = true;
          index = idx;
        } else {
          data[idx].flag = false;
        }
      }
      data[idx].createdAt = app.util.formatTime(new Date(data[idx].createdAt));
    }

    var messageList = that.data.messageList;
    for (var i in data) {
      // messageList.push(data.messages[i]);
      messageList = that.prepend(messageList, data[i]);
    }
    that.setData({
      // chatList: data,
      messageList: messageList
    });
  },
  prepend: function (arr, item) {
    var m = arr.slice();
    m.unshift(item);
    return m;
  },
  sendMessage: function(otherId, msg,callback) {
    var that = this;
    var data = {
      othersWxUserId: otherId,
      msg: msg
    }
    app.apiFunctions.requestUrl(
      app.api.sendMessage,
      'POST',
      true,
      true,
      data,
      function(data) {
        console.log('a');
        console.log(data.data);
        if (data.status == 1) {
          that.setData({
            msg:'',
            // messageList:[]
          })
          // page=1;
          // that.getMessageByOrtherUserId(otherId);
        } else {
          wx.showToast({
            title: '网络错误，请稍后...',
          })
        }
      }
    );
  },
  setMessageReaded: function(otherId) {
    var that = this;
    var data = {
      othersWxUserId: otherId
    }
    app.apiFunctions.requestUrl(
      app.api.setRead,
      'POST',
      true,
      true,
      data,
      function(data) {
        console.log(data);
        if (data.status == 1) {

        }
      }
    );
  },
  onAvatarTap:function(e){
    var wxUserId = e.currentTarget.dataset.wxuserid;
    console.log(wxUserId);
    wx.navigateTo({
      url: '../more/more?userId='+wxUserId,
    })
  },
  onGetUserInfoTap: function (e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      console.log('queding');
      this.getUserInfo(e.detail.userInfo);
      this.setData({
        myMsg: e.detail.userInfo
      })
    } else {
      // this.setData({
      // })
    }
  },
  getUserInfo: function (data) {
    var url = `${app.api.userInfo}`;
    var that = this;
    var data = {
      "nickName": data.nickName,
      "gender": data.gender,
      "country": data.country,
      "province": data.province,
      "city": data.city,
      "avatarUrl": data.avatarUrl
    }
    app.apiFunctions.requestUrl(
      url,
      'POST',
      true,
      false,
      data,
      function (data) {
        if (data.status == 1) {
          console.log(data);
        }
      }
    );
  },
  getMyMsg: function (e) {
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.getMyMsg,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            myMsg: data.data
          })
        }
      }
    );
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
    this.interval2 = setInterval(this.getUnreadMessage, 5000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide');
    var that = this;
    clearInterval(that.interval2);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload');
    var that = this;
    clearInterval(that.interval2);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh');
    wx.showNavigationBarLoading();
    this.getMessage(this.data.chatList.id);
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