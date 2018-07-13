const wxCharts = require('../../utils/wxcharts.js');
let lineChart = null;
let app = getApp();
const tools = require('../../tools.js');
var page = 1;
var page_size = 15;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    inputVal: "",
    inputShowed: false,
    search: false,
    timeStatus: [{
        id: '0',
        name: '最近一个星期'
      },
      {
        id: '1',
        name: '最近一个月'
      },
      {
        id: '2',
        name: '最近三个月'
      },
      {
        id: '3',
        name: '最近半年'
      },
      {
        id: '4',
        name: '最近一年'
      }
    ],
    columnStatus: [{
        id: 1,
        name: '全部'
      },
      {
        id: 2,
        name: '当年茶'
      },
      {
        id: 3,
        name: '新茶'
      },
      {
        id: 4,
        name: '中期茶'
      }

    ],
    title: {
      name: '产品名',
      price: '参考价',
      up: '升跌',
      percent: '升跌幅'
    },
    status: '全部',
    indexStatus: '1',
    teaList: [],
    showChapter: false,
    chooseChapter: '请选择分类',
    chapterList: [
      {
        name: '年份',
        id: 440000,
        subchapter: [
          {
            name: '2018年',
            id: 440100
          },
          {
            name: '2017年',
            id: 440200
          },
          {
            name: '2016年',
            id: 440200
          },
          {
            name: '2015年',
            id: 440200
          },
          {
            name: '2014年',
            id: 440200
          },
          {
            name: '2013年',
            id: 440200
          },
          {
            name: '2012年',
            id: 440200
          },
          {
            name: '2011年',
            id: 440200
          },
          {
            name: '2010年',
            id: 440200
          },
          {
            name: '2009年',
            id: 440200
          },
          {
            name: '2008年',
            id: 440200
          },
          {
            name: '2007年',
            id: 440200
          },
          {
            name: '2006年',
            id: 440200
          },
          {
            name: '2005年',
            id: 440200
          },
          {
            name: '2004年',
            id: 440200
          },
          {
            name: '2003年',
            id: 440200
          },
          {
            name: '2002年',
            id: 440200
          },
          {
            name: '2001年',
            id: 440200
          },
          {
            name: '2000年',
            id: 440200
          }
        ]
      }
    ],
    chapter: [
      {
        name: '全部',
        list: [],
        open: true,
      },
      {
        name: '按年份筛选',
        list: [
        ],
        open: true
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getTealist(this.data.indexStatus);
  },
  onShow: function (options) {
    page = 1;
    this.setData({
      teaList:[],
      hidden: false
    })
    this.getTealist(this.data.indexStatus);
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 10000);
  },
  onTypeTap: function(e) {
    var status = e.currentTarget.dataset.status;
    var id = e.currentTarget.dataset.id;
    page = 1;
    this.setData({
      status: status,
      indexStatus: id,
      teaList: [],
      hidden: false
    })
    this.getTealist(id);
  },
  getTealist: function(id) {
    var that = this;
    var data = {
      indexStatus: id,
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      app.api.getTeaclassify,
      'GET',
      true,
      true,
      data,
      function(data) {
        if (data.statusCode == 200)
          page++;
        var teaList = that.data.teaList;
        for (var i = 0; i < data.data.length; i++) {
          let temp = {};
          if (data.data[i].fields.riseAndFall.substr(0, 1) == '升'){
             temp={
               model: data.data[i].model,
               pk: data.data[i].pk,
               riseAndFallStatus: 1,
               fields: data.data[i].fields
             }
          } else if (data.data[i].fields.riseAndFall.substr(0, 1) == '降'){
            temp = {
              model: data.data[i].model,
              pk: data.data[i].pk,
              riseAndFallStatus: 0,
              fields: data.data[i].fields
            }
          }else{
            temp = {
              model: data.data[i].model,
              pk: data.data[i].pk,
              riseAndFallStatus: 0,
              fields: data.data[i].fields
            }
          }
          teaList.push(temp);
        }
       
        that.setData({
          teaList: teaList,
          hidden: true
        })
      }
    );
  },
  onReachBottom: function() {
    var that = this;
    this.setData({
      hidden:false
    })
    this.getTealist(this.data.indexStatus);
  },
  /******搜索输入 */
  // 弹窗
  onChangeShowState: function (e) {
    console.log('展开');
    let that = this;
    that.setData({
      showChapter: (!that.data.showChapter),
    })
  },
  subClassify: function (e) {
    console.log('subClassify');
    var _self = this;
    var classifyId = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    _self.getGoodsList(app.shopId, classifyId)
    _self.onChangeShowState();
    this.setData({
      breadCrumb: name
    });
  },
  subChapter: function (e) {
    console.log('subChapter');
    let that = this;
    let showChapter = that.data.showChapter;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let chapterType = e.currentTarget.dataset.type;
    let classifyId = e.currentTarget.dataset.classifyid;
    let chooseChapter = e.currentTarget.dataset.name;
    console.log(e.currentTarget.dataset.name);
    let superIndex = +index.split('-')[0];
    let subIndex = +index.split('-')[1];
    let item = null;

    switch (chapterType) {
      case 'classify':
        break;
      case 'area':
        item = that.data.chapterList[superIndex].subClassifies[subIndex];
        let superItem = that.data.chapterList[superIndex];
        break;
    }

    this.setData({
      breadCrumb: name,
      showChapter: false,
      classifyId: classifyId,
      chooseChapter: chooseChapter
    });
    if (name) {
      console.log(name);
      wx.navigateTo({
        url: '../searchtea/searchtea?name=' + name,
      })
    }
  },
  onChangeShowState: function () {
    console.log('onChangeShowState');
    let that = this;
    that.setData({
      showChapter: (!that.data.showChapter),
    })
  },
  kindToggle: function (e) {
    console.log('kindToggle')
    let that = this;
    let showChapter = that.data.showChapter;
    let index = e.currentTarget.dataset.index;
    let chapterType = e.currentTarget.dataset.type;
    let item = null;
    let list = [];
    let breadCrumb = '';
    console.log(index)
    switch (chapterType) {
      case 'chapter':
        item = that.data.chapterList[index];
        list = that.data.chapterList[index].subchapter;
        !list.length && (breadCrumb = item.name);
        break;
      case 'area':
        item = that.data.chapterList[index];
        list = that.data.chapterList[index].subchapter;
        !list.length && (breadCrumb = `按章节显示 | ${item.subchapter}`);
        break;
    }

    item.open = (!!list.length) && (!item.open);
    !list.length && (showChapter = false);

    that.setData({
      chapter: that.data.chapter,
      chapterList: that.data.chapterList,
      showChapter: showChapter,
      breadCrumb: breadCrumb
    });
  },
  onYearTap:function(e){
    var name = e.currentTarget.dataset.name;
    if (name) {
      console.log(name);
      wx.navigateTo({
        url: '../searchtea/searchtea?name=' + name,
      })
    }
    this.setData({
      showChapter: false
    })
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
    var that = this;
    clearInterval(that.interval);
  },
  onUnload: function () {
    var that = this;
    clearInterval(that.interval);
  },
})