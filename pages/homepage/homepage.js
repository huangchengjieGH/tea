// pages/homepage/homepage.js
let app = getApp();
const tools = require('../../tools.js');

var page = 1;
var page_size = 10;

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
    publishList:[],
    nodata:false,
    photos: []
  },
  GetQueryString: function (url, key) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.split("?")[1];
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest[key];
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var requireId = options.requireId;
    // var requireId = 8;
    var scene = decodeURIComponent(options.scene);
    if (requireId == null || requireId==''){
      requireId = this.GetQueryString(scene, 'requireId');
    }
    console.log('url');
    console.log(scene);
    console.log(requireId);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 190
        });
      }
    });
    if (requireId != null && requireId!=''){
      this.setData({
        requireId: requireId,
        hideShare: false
      })
      this.getSharePublish(requireId);
      this.getVisit(requireId);
    }

    page = 1;
    this.setData({
      status: '智能推荐',
      publishList: []
    })
    this.getRecommendList();
    this.getMyMsg();
  },
  onShow: function () {
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 20000);
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
    var maxLength = false;
    var length = 0;
    console.log('hcj')
    console.log(data);
    for (var idx in data){
      maxLength = false;
      length = 0;
      var object = data[idx].objects;
      var obj = data[idx].objects;
      data[idx].updatedAt = app.util.formatTime(new Date(data[idx].updatedAt)); 
      data[idx].createdAt = app.util.formatTime(new Date(data[idx].createdAt));  
      length += object.length;
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
        if (object.length >=15){
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
      data[idx].maxLength = maxLength;
      data[idx].length = length;
      objects = [];
    }  

    var publishList = that.data.publishList;
    for (var i = 0; i < data.length; i++) {
      publishList.push(data[i]);
    }
    if (publishList.length ==0){
      this.setData({
        nodata:true
      })
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
    var maxLength = false;
    var length = 0;
    var object = data.objects;
    data.updatedAt = app.util.formatTime(new Date(data.updatedAt));
    data.createdAt = app.util.formatTime(new Date(data.createdAt));
    length += object.length;
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
        if (object.length >= 15) {
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
      data.maxLength = maxLength;
      data.length = length;
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
        console.log(data.data);
        if (data.status == 1) {
          page++;
          that.setData({
            hidden: true
          });
          that.processPublishData(data.data);
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
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
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    );
  },
  getSharePublish: function (requireId) {
    var that = this;
    var url = `${app.api.getPublish}` + '/' + `${requireId}`;
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
      var title = '关注成功';
    }else{
      var url = `${app.api.uncollect}`;
      var title = '取消关注';
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
  onCheckMoreTap:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../more/more?requireId=' + id,
    })
  },
  onAvatarTap:function(e){
    var url = e.currentTarget.dataset.url;
    var photoList = [];
    var temp = {};
    temp={
      url:url
    }
    photoList.push(temp);
    console.log(photoList);
    this.setData({
      photos: photoList
    })
    this.previewImage();
  },
  previewImage: function (e) {
    // let index = e.currentTarget.dataset.index;
    let index = 0;
    let imgList = [];
    this.data.photos.forEach(photo => {
      imgList.push(photo.url);
    });
    console.log(imgList);
    wx.previewImage({
      current: imgList[index],
      urls: imgList
    });
  },
  onBodyTap:function(e){
    // console.log('ssss');
    var requireId = e.currentTarget.dataset.requireid;
    var ortherUserId = e.currentTarget.dataset.ortheruserid;
    this.getVisit(requireId);
    wx.navigateTo({
      url: '../chat/chat?ortherUserId=' + ortherUserId,
    })
    console.log(requireId);
  },
  getUnreadCount: function (e) {
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
            unReadCount:data.data
          })
        }
      }
    );
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
    console.log('onHide');
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
    console.log('onPullDownRefresh');
    wx.showNavigationBarLoading();
    page = 1;
    this.setData({
      publishList: []
    })
    if(this.data.status == '最新发布'){
      this.getPublishList();
    }else{
      this.getRecommendList();
    }    
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
             myMsg:data.data
           })
        }
      }
    );
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onPullDownRefresh');
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