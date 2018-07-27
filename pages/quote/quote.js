// pages/searchtea/searchtea.js
let app = getApp();
const tools = require('../../tools.js');
var page = 1;
var page_size = 100;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    inputShowed: true,
    search: false,
    history: [],
    hot: [],
    body: false,
    teaList: [],
    nodata: false,
    showHistory: true,
    showHot: true,
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
  onLoad: function (options) {
    var name = options.name;
    console.log(name);
    if (name) {
      page = 1;
      name = name.substring(0, 4);
      this.setData({
        teaList: []
      })
      this.getSearchTeaByYear(name);
    }
  },
  /***搜索输入 */
  showInput: function () {
    console.log("showInput");
    this.setData({
      inputShowed: true,
      showHistory: true,
      showHot: true
    });
  },
  checkinputTyping: function (e) {
    console.log('checkinputTyping');
    var queryString = e.detail.value;
    this.setData({
      inputVal: queryString,
      showHistory: true,
      showHot: true
    })
  },
  inputTyping: function (e) {
    console.log("inputTyping");
    var that = this;
    var queryString = e.detail.value;
    if (queryString != '') {
      page = 1;
      this.setData({
        str: queryString,
        teaList: []
      });
      that.getSearchTea(queryString);
      that.recordSearchTea(queryString);
    }
  },
  onSearchTap: function (e) {
    console.log('onSearchTap');
    var that = this;
    if (this.data.str) {
      page = 1;
      this.setData({
        teaList: []
      })
      that.getSearchTea(this.data.str);
      that.recordSearchTea(this.data.str);
    }

  },
  clearInput: function (e) {
    this.setData({
      inputVal: '',
      inputShowed: false,
      search: false,
      showHistory: true,
      showHot: true,
      teaList: []
    })
  },
  hideInput: function () {
    console.log("hideInput");
    this.setData({
      inputVal: "",
      inputShowed: false,
      search: false,
      showHistory: false
    });
  },
  onClearHotTap: function (e) {
    this.setData({
      inputVal: "",
      inputShowed: false,
      search: false,
      showHot: false
    });
  },
  onClearTap: function (e) {
    this.setData({
      showHistory: false
    });
  },
  onHistoryTap: function (e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      inputVal: name
    })
    if (name) {
      page = 1;
      this.setData({
        teaList: []
      })
      this.getSearchTea(name);
      this.recordSearchTea(name);
    }

    console.log(name);
  },
  onHotTap: function (e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      inputVal: name
    })
    if (name) {
      page = 1;
      this.setData({
        teaList: []
      })
      this.getSearchTea(name);
      this.recordSearchTea(name);
    }
    console.log(name);
  },
  getSearchTea: function (name) {
    var that = this;
    var index = '';
    var price = '';
    var date = '';
    var data = {
      name: name,
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      app.api.searchTea,
      'GET',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.statusCode == 200)
          page++;
        var teaList = that.data.teaList;
        var temp = {};
        for (var i = 0; i < data.data.length; i++) {
          var referencePrice = data.data[i].fields.referencePrice;
          index = referencePrice.indexOf('(');
          price = referencePrice.substring(0, index);
          date = referencePrice.substring(index + 1, referencePrice.length);
          date = date.replace(/[^0-9-]/ig, "");
          console.log(date);
          temp = {
            model: data.data[i].model,
            pk: data.data[i].pk,
            price: price,
            updateDate: date,
            fields: data.data[i].fields
          }
          teaList.push(temp);
        }
        that.setData({
          teaList: teaList,
          showHistory: false,
          showHot: false,
          body: true
        })
        if (teaList.length == 0) {
          that.setData({
            nodata: true
          })
        } else {
          that.setData({
            nodata: false
          })
        }
      }
    );
  },
  getSearchTeaByYear: function (name) {
    var that = this;
    var index = '';
    var price = '';
    var date = '';
    var data = {
      year: name,
      page: page,
      pageSize: page_size,
    }
    app.apiFunctions.requestUrl(
      app.api.searchTea,
      'GET',
      true,
      true,
      data,
      function (data) {
        console.log(data);
        if (data.statusCode == 200)
          page++;
        var teaList = that.data.teaList;
        var temp = {};
        for (var i = 0; i < data.data.length; i++) {
          var referencePrice = data.data[i].fields.referencePrice;
          index = referencePrice.indexOf('(');
          price = referencePrice.substring(0, index);
          date = referencePrice.substring(index + 1, referencePrice.length);
          date = date.replace(/[^0-9-]/ig, "");
          console.log(date);
          temp = {
            model: data.data[i].model,
            pk: data.data[i].pk,
            price: price,
            updateDate: date,
            fields: data.data[i].fields
          }
          teaList.push(temp);
        }
        that.setData({
          teaList: teaList,
          showHistory: false,
          showHot: false,
          body: true
        })
        if (teaList.length == 0) {
          that.setData({
            nodata: true
          })
        } else {
          that.setData({
            nodata: false
          })
        }
      }
    );
  },

  recordSearchTea: function (name) {
    var that = this;
    var type = '10'
    var url = `${app.api.search}` + '?str=' + `${name}` + '&type=' + `${type}`;
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log('hcj');
        console.log(data);
        if (data.status == 1) {
        }
      }
    );
  },
  getHotSearchTea: function (e) {
    var that = this;
    var url = `${app.api.hotSearch}` + '?type=' + '10&page=1&pageSize=20';
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log('hotsearch');
        console.log(data);
        if (data.status == 1) {
          if (data.data.length > 0) {
            that.setData({
              hot: data.data
            })
          } else {
            that.setData({
              showHot: false
            })
          }

        }
      }
    );
  },
  getHistorySearchTea: function (e) {
    var that = this;
    var url = `${app.api.historySearch}` + '?type=' + '10&page=1&pageSize=10';
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log('historySearch');
        console.log(data);
        if (data.status == 1) {
          if (data.data.length > 0) {
            that.setData({
              history: data.data
            })
          } else {
            that.setData({
              showHistory: false
            })
          }

        }
      }
    );
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
      page = 1;
      name = name.substring(0, 4);
      that.setData({
        teaList: []
      })
      this.getSearchTeaByYear(name);
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

  onYearTap: function (e) {
    var name = e.currentTarget.dataset.name;
    if (name) {
      page = 1;
      name = name.substring(0, 4);
      this.setData({
        teaList: [],
        showChapter: false,
      })
      this.getSearchTeaByYear(name);
    }
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
    this.getHotSearchTea();
    this.getHistorySearchTea();
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