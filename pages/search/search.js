// pages/search/search.js
let app = getApp();
const tools = require('../../tools.js');
var page = 1;
var page_size = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    inputShowed: false,
    inputVal: "",
    scrollTop: 0,
    scrollHeight: 0,
    publishList: [],
    search:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 30
        });
      }
    });
    this.getPublishList();
  },
  showInput: function () {
    console.log("onChangeShowState");
    this.setData({
      inputShowed: true
    });
  },
  inputTyping: function (e) {
    console.log("inputTyping");
    var queryString = e.detail.value;
    this.setData({
      str: queryString,
    });
    if (queryString!= ''){
      this.setData({
        search:true,
        publishList:[]
      })
      page = 1;
      this.getPublishList();
    } 
  },
  onChangeShowState: function () {
    console.log("onChangeShowState");
    var that = this;
    that.setData({
      showCategory: (!that.data.showCategory),
    })
  },
  hideInput: function () {
    console.log("hideInput");
    this.setData({
      inputVal: "",
      inputShowed: false,
      search:false,
      publishList: []
    });
    page = 1;
    this.getPublishList();
  },
  // productInput: function (e) {
  //   var str = e.detail.value;
  //   this.setData({
  //     str: str
  //   })
  //   this.searchTea();
  // },
  searchTea: function (e) {
    var that = this;
    var url = `${app.api.search}` + '?str=' + `${that.data.str}`;
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        that.setData({
          publishList: []
        })
        if (data.status == 1) {
          that.processPublishData(data.data)
        }
      }
    );
  },
  getPublishList: function (e) {
    var that = this;
    var data = {
      page: page,
      pageSize: page_size,
    }
    if(this.data.search){
      // var url = `${app.api.search}` + '?str=' + `${that.data.str}`;
      var url = `${app.api.search}`;
      var data = {
        page: page,
        pageSize: page_size,
        str: that.data.str
      }
    }else{
      var url = `${app.api.getPublish}`
    }
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      false,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          page++;
          that.processPublishData(data.data);
          that.setData({
            hidden: true
          });
        }
      }
    );
  },
  processPublishData: function (data) {
    // var object = data.objects;
    var that = this;
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
  },
  bindDownLoad: function () {
    var that = this;
    this.setData({
      hidden: false
    })
    this.getPublishList();

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
  onPhoneTap: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
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