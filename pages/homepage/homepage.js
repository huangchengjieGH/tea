// pages/homepage/homepage.js
let app = getApp();
const tools = require('../../tools.js');

var page = 1;
var page_size = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    columnStatus: [
      {
        id: 0,
        name: '智能推荐'
      },
      {
        id: 1,
        name: '最新发布'
      },

    ],
    status: '智能推荐',
    hideShare:true,
    scrollTop: 0,
    scrollHeight: 0,
    publishList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getPublishList();
    // var url = decodeURIComponent(options.q);
    var userId = options.userId;
    // var userId = 3;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 190
        });
      }
    });
    if (userId != null && userId != ''){
      this.setData({
        userId: userId,
        hideShare: false
      })
      this.getSharePublish(userId);
      this.getVisit(userId);
    }
  },
  onShow: function () {
    page=1;
    this.getRecommendList();
  },
  onTypeTap: function (e) {
    var status = e.currentTarget.dataset.status;
    console.log(status)
    this.setData({
      status: status
    })
    if (status =='最新发布'){
      page = 1;
      this.setData({
        publishList:[]
      })
      this.getPublishList();
    }
    if (status == '智能推荐'){
      page = 1;
      this.setData({
        publishList: []
      })
      this.getRecommendList();
    }
  },
  onPublishTap: function (e) {
    wx.redirectTo({
      url: '../publish/publish',
    })
  },
  onAttentionTap:function(e){
    wx.redirectTo({
      url: '../attention/attention',
    })
  },
  processPublishData:function(data){
    // var object = data.objects;
    var that = this;
    var objects= [];
    var temp = {};
    var find01=[];  //我要找
    var find02=[];  //代客找
    var out01=[];   // 出
    var out02=[];   //代客出
    for (var idx in data){
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
        find01=[];
      }
      if (find02.length != 0) {
        temp = {
          style: '0',
          classify: '代客找',
          object: find02
        }
        objects.push(temp);
        find02=[];
      }
      if (out01.length != 0) {
        temp = {
          style:'1',
          classify: '出',
          object: out01
        }
        objects.push(temp);
        out01=[];
      }
      if (out02.length != 0) {
        temp = {
          style: '1',
          classify: '代客出',
          object: out02
        }
        objects.push(temp);
        out02=[];
      }
      data[idx].objects = objects;
      objects = [];
    }  

    var publishList = that.data.publishList;
    for (var i = 0; i < data.length; i++) {
      publishList.push(data[i]);
    }
    that.setData({
      publishList: publishList
    });

    // this.setData({
    //   publishList: data
    // })
    console.log(new Date());
  },
  processShareData: function (data) {
    // var object = data.objects;
    var objects = [];
    var temp = {};
    var find01 = [];  //我要找
    var find02 = [];  //代客找
    var out01 = [];   // 出
    var out02 = [];   //代客出
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
      objects = [];
    

    this.setData({
      shareList: data
    })

  },
  getPublishList:function(e){
    var that = this;
    var data = {
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      app.api.getPublish,
      'GET',
      true,
      false,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          page++;
          that.setData({
            hidden: true
          });
          that.processPublishData(data.data);
        }
      }
    );
  },
  getVisit: function (requireId) {
    var that = this;
    var data = {
      requireId: requireId
    }
    app.apiFunctions.requestUrl(
      app.api.visit,
      'POST',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          
        }
      }
    );
  },
  getRecommendList: function (e) {

    console.log(new Date());
    var that = this;
    var data = {
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      app.api.recommend,
      'GET',
      true,
      false,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          console.log(new Date());
          page++;
          that.setData({
            hidden: true
          });
          that.processPublishData(data.data);     
        }
      }
    );
  },
  getSharePublish: function (userId) {
    var that = this;
    var url = `${app.api.getPublish}` + '/' + `${userId}`;
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.processShareData(data.data, 1)
        }
      }
    );
  },
  onPhoneTap:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  // productInput:function(e){
  //  var str = e.detail.value;
  //  this.setData({
  //    str:str
  //  })
  //  this.searchTea();
  // },
  // searchTea:function(e){
  //   var that = this;
  //   var url = `${app.api.search}` + '?str=' + `${this.data.str}`;
  //   app.apiFunctions.requestUrl(
  //     url,
  //     'GET',
  //     true,
  //     true,
  //     '',
  //     function (data) {
  //       console.log(data);
  //       if (data.status == 1) {
  //         that.processPublishData(data.data)
  //       }
  //     }
  //   );
  // },
  onInputTap:function(e){
    // console.log('hshs');
    // this.setData({
    //   hideShare:true
    // })
  },
  collectTea: function (e) {
    // var flag = 0;
    var requireId = e.currentTarget.dataset.requireid;
    var like = e.currentTarget.dataset.like;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var that = this;
    var publishList = that.data.publishList;
    var data = {
      requireId: requireId
    };
    if (!like){
      var url = `${app.api.collect}`;
      var title = '收藏成功';
    }else{
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
          publishList[index].like = !that.data.publishList[index].like;
          that.setData({
            teaList: data.data,
            edit: false,
            publishList: publishList
          })
        }
      }
    );
  },
  /****下拉刷新 */
  bindDownLoad: function () {
    var that = this;
    this.setData({
      hidden: false
    })
    if(this.data.status == '智能推荐'){
      this.getRecommendList();
    }else{
      this.getPublishList();
    }
    
    console.log("bindDownLoad");
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
    console.log('scroll');
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    //  page = 1;
    // this.setData({
    //   publishList:[]
    // })
    // if (status == '智能推荐') {
    //   this.getRecommendList();
    // } else {
    //   this.getPublishList();
    // }
    console.log("topLoad");
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


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
    console.log('onPullDownRefresh');
    // this.setData({
    //   hideShare:false
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    this.setData({
      hidden: false
    })
    if (this.data.status == '智能推荐') {
      this.getRecommendList();
    } else {
      this.getPublishList();
    }
    console.log('onReachBottom');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})