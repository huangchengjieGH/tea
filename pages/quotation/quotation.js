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
    hidden: true,
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
    chapterList: [{
      name: '年份',
      id: 440000,
      subchapter: [{
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
    }],
    year: [{
        name: '不限',
        id: -1,
        choosed: true
      },
      {
        name: '2018年',
        id: 0,
        choosed: false
      },
      {
        name: '2017年',
        id: 1,
        choosed: false
      },
      {
        name: '2016年',
        id: 2,
        choosed: false
      },
      {
        name: '2015年',
        id: 3,
        choosed: false
      },
      {
        name: '2014年',
        id: 4,
        choosed: false
      },
      {
        name: '2013年',
        id: 5,
        choosed: false
      },
      {
        name: '2012年',
        id: 6,
        choosed: false
      },
      {
        name: '2011年',
        id: 7,
        choosed: false
      },
      {
        name: '2010年',
        id: 8,
        choosed: false
      },
      {
        name: '2009年',
        id: 9,
        choosed: false
      },
      {
        name: '2008年',
        id: 10,
        choosed: false
      },
      {
        name: '2007年',
        id: 11,
        choosed: false
      },
      {
        name: '2006年',
        id: 12,
        choosed: false
      },
      {
        name: '2005年',
        id: 13,
        choosed: false
      },
      {
        name: '2004年',
        id: 14,
        choosed: false
      },
      {
        name: '2003年',
        id: 15,
        choosed: false
      },
      {
        name: '2002年',
        id: 16,
        choosed: false
      },
      {
        name: '2001年',
        id: 17,
        choosed: false
      },
      {
        name: '2000年',
        id: 18,
        choosed: false
      },
      {
        name: '1999年',
        id: 19,
        choosed: false
      },
      {
        name: '1998年',
        id: 20,
        choosed: false
      },
      {
        name: '1997年',
        id: 21,
        choosed: false
      },
      {
        name: '1996年',
        id: 22,
        choosed: false
      }
    ],
    process: [{
        name: '全部',
        id: -1,
        choosed: true
      },
      {
        name: '生茶',
        id: 0,
        choosed: false
      },
      {
        name: '熟茶',
        id: 1,
        choosed: false
      },
      {
        name: '生熟套装',
        id: 2,
        choosed: false
      }
    ],
    chapter: [{
        name: '全部',
        list: [],
        open: true,
      },
      {
        name: '按年份筛选',
        list: [],
        open: true
      }
    ],
    chooseYear: '不限',
    chooseProcess: '全部'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getTealist(this.data.indexStatus);
    this.setData({
      yearCycle: this.data.year
    })
    var data = {
      page: page,
      pageSize: page_size,
      indexStatus: this.data.indexStatus
    }
    this.getTealists(data);
  },
  onShow: function(options) {
    // page = 1;
    // this.setData({
    //   teaList:[],
    //   hidden: false
    // })
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 30000);
  },
  onTypeTap: function(e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var id = e.currentTarget.dataset.id;
    var yearCycle = that.data.year;
    switch (id) {
      case 1:
        yearCycle: that.data.year;
        break;
      case 2:
        yearCycle = yearCycle.slice(0, 3);
        break;
      case 3:
        yearCycle = yearCycle.slice(3, 13);
        yearCycle = that.prepend(yearCycle, that.data.year[0]);
        break;
      case 4:
        yearCycle = yearCycle.slice(13);
        yearCycle = that.prepend(yearCycle, that.data.year[0]);
        break;
      default:
        yearCycle: yearCycle
    }
    console.log(yearCycle);
    page = 1;
    var  data = {};
    this.setData({
      status: status,
      indexStatus: id,
      teaList: [],
      hidden: false,
      yearCycle: yearCycle,
      chooseYear: '不限'
    })
    var yearCycle = this.data.yearCycle;
    yearCycle = this.judgeChooseType(yearCycle, this.data.chooseYear);
    this.setData({
      yearCycle: yearCycle,
      hidden:false
    })
    data = this.chooseCondition();
    this.getTealists(data);
    
  },
  prepend: function(arr, item) {
    var m = arr.slice();
    m.unshift(item);
    return m;
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
          data.data[i].fields.percent = data.data[i].fields.percent.replace(/\s+/g, "");
          if (data.data[i].fields.riseAndFall.substr(0, 1) == '升') {
            temp = {
              model: data.data[i].model,
              pk: data.data[i].pk,
              riseAndFallStatus: 1,
              fields: data.data[i].fields
            }
          } else if (data.data[i].fields.riseAndFall.substr(0, 1) == '降') {
            temp = {
              model: data.data[i].model,
              pk: data.data[i].pk,
              riseAndFallStatus: 0,
              fields: data.data[i].fields
            }
          } else {
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
  getTealists: function(data) {
    var that = this;
    var data = data;
    var index = '';
    var price = '';
    var date = '';
    app.apiFunctions.requestUrl(
      app.api.quote,
      'GET',
      true,
      true,
      data,
      function(data) {
        console.log(data);
        that.setData({
          hidden:true
        })
        if (data.statusCode == 200)
          page++;
        var teaList = that.data.teaList;
        for (var i = 0; i < data.data.length; i++) {
          let temp = {};
          var referencePrice = data.data[i].referencePrice;
          index = referencePrice.indexOf('(');
          price = referencePrice.substring(0, index);

          date = referencePrice.substring(index + 1, referencePrice.length);
          date = date.replace(/[^0-9-]/ig, "");
          data.data[i].updateDate = date;

          if (data.data[i].riseAndFall.substr(0, 1) == '升') {
            temp = {
              riseAndFallStatus: 1,
              fields: data.data[i]
            }
          } else if (data.data[i].riseAndFall.substr(0, 1) == '降') {
            temp = {
              riseAndFallStatus: 0,
              fields: data.data[i]
            }
          } else {
            temp = {
              riseAndFallStatus: 0,
              fields: data.data[i]
            }
          }
          teaList.push(temp);
        }

        that.setData({
          teaList: teaList
        })
      }
    );
  },
  onReachBottom: function() {
    var that = this;
    var data = {};
    this.setData({
      // hidden: false
    })
    data = this.chooseCondition();
    this.getTealists(data);
    // this.getTealist(this.data.indexStatus);
  },
  /******搜索输入 */
  // 弹窗
  onChangeShowState: function(e) {
    console.log('展开');
    let that = this;
    that.setData({
      showChapter: (!that.data.showChapter),
    })
  },
  subClassify: function(e) {
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
  subChapter: function(e) {
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
  onChangeShowState: function() {
    console.log('onChangeShowState');
    let that = this;
    that.setData({
      showChapter: (!that.data.showChapter),
    })
  },
  kindToggle: function(e) {
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
  onYearTap: function(e) {
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
  chooseCondition:function(e){
    var data = {};
    if (this.data.chooseProcess == '全部') {
      if (this.data.chooseYear == '不限') {
        data = {
          page: page,
          pageSize: page_size,
          indexStatus: this.data.indexStatus
        }
      } else {
        data = {
          page: page,
          pageSize: page_size,
          year: this.data.chooseYear
        }
      }
    } else {
      if (this.data.chooseYear == '不限') {
        data = {
          page: page,
          pageSize: page_size,
          indexStatus: this.data.indexStatus,
          productionTechnology: this.data.chooseProcess
        }
      } else {
        data = {
          page: page,
          pageSize: page_size,
          year: this.data.chooseYear,
          productionTechnology: this.data.chooseProcess
        }
      }
    }
    return data;
  },
  onYearChoose: function(e) {
    var name = e.currentTarget.dataset.name;
    var yearCycle = this.data.yearCycle;
    var data = {};
    yearCycle = this.judgeChooseType(yearCycle, name);
    var chooseYear = name.substring(0, 4);
    this.setData({
      chooseYear: chooseYear,
      yearCycle: yearCycle
    })
    page = 1;
    // if (this.data.chooseProcess == '全部') {
    //   if (chooseYear == '不限') {
    //     data = {
    //       page: page,
    //       pageSize: page_size,
    //       indexStatus: this.data.indexStatus
    //     }
    //   } else {
    //     data = {
    //       page: page,
    //       pageSize: page_size,
    //       year: chooseYear
    //     }
    //   }
    // } else {
    //   if (chooseYear == '不限') {
    //     data = {
    //       page: page,
    //       pageSize: page_size,
    //       indexStatus: this.data.indexStatus,
    //       productionTechnology: this.data.chooseProcess
    //     }
    //   } else {
    //     data = {
    //       page: page,
    //       pageSize: page_size,
    //       year: chooseYear,
    //       productionTechnology: this.data.chooseProcess
    //     }
    //   }
    // }
    data = this.chooseCondition();
    this.setData({
      teaList: [],
      hidden: false
    })
    this.getTealists(data);
  },
  onProcessChoose: function(e) {
    var name = e.currentTarget.dataset.name;
    var data = {};
    // name = name.substring(0, 4);
    var process = this.data.process;
    process = this.judgeChooseType(process, name);
    this.setData({
      chooseProcess: name.substring(0, 4),
      process: process
    })
    page = 1;
    this.setData({
      teaList: [],
      hidden: false
    })
    data = this.chooseCondition();
    this.getTealists(data);
    // console.log(name);
  },
  judgeChooseType: function(data, name) {
    for (var idx in data) {
      if (data[idx].name == name) {
        data[idx].choosed = true;
      } else {
        data[idx].choosed = false;
      }
    }
    return data;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide');
    var that = this;
    clearInterval(that.interval);
  },
  onUnload: function() {
    var that = this;
    clearInterval(that.interval);
  },
})