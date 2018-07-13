const wxCharts = require('../../utils/wxcharts.js');
let lineChart = null;
let app = getApp();
const tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    priceList: [{
        date: '2018-01-01',
        price: '12'
      },
      {
        date: '2018-01-03',
        price: '14'
      },
      {
        date: '2018-01-04',
        price: '15'
      },
      {
        date: '2018-01-08',
        price: '18'
      },
      {
        date: '2018-01-12',
        price: '20'
      },
      {
        date: '2018-01-15',
        price: '9'
      },
      {
        date: '2018-01-20',
        price: '8'
      },
      {
        date: '2018-02-01',
        price: '4'
      },
      {
        date: '2018-02-02',
        price: '20'
      },
      {
        date: '2018-02-09',
        price: '21'
      },
      {
        date: '2018-02-15',
        price: '30'
      },
      {
        date: '2018-02-19',
        price: '40'
      },
      {
        date: '2018-02-20',
        price: '35'
      },
      {
        date: '2018-02-25',
        price: '34'
      },
      {
        date: '2018-02-30',
        price: '32'
      },
      {
        date: '2018-03-01',
        price: '30'
      },
      {
        date: '2018-03-03',
        price: '32'
      },
      {
        date: '2018-03-06',
        price: '23'
      },
      {
        date: '2018-03-10',
        price: '20'
      },
      {
        date: '2018-03-15',
        price: '24'
      },
      {
        date: '2018-03-18',
        price: '10'
      },
      {
        date: '2018-03-20',
        price: '12'
      },
      {
        date: '2018-03-21',
        price: '9'
      },
      {
        date: '2018-03-24',
        price: '4'
      },
      {
        date: '2018-03-26',
        price: '23'
      },
      {
        date: '2018-03-39',
        price: '24'
      },
      {
        date: '2018-04-01',
        price: '35'
      },
      {
        date: '2018-04-02',
        price: '40'
      },
      {
        date: '2018-04-03',
        price: '45'
      },
      {
        date: '2018-04-14',
        price: '60'
      },
      {
        date: '2018-04-15',
        price: '55'
      },
      {
        date: '2018-04-16',
        price: '40'
      },
      {
        date: '2018-04-17',
        price: '35'
      },
      {
        date: '2018-04-18',
        price: '38'
      },
      {
        date: '2018-04-19',
        price: '20'
      },
      {
        date: '2018-04-20',
        price: '60'
      },
      {
        date: '2018-04-21',
        price: '65'
      }
    ],
    time: '2',
    windowWidth: 320,
    canvasId: 'lineCanvas',
    startTime: '2018-01-01',
    endTime: '2018-12-01',
    name: '1801 益原素',
    upWan: '0'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var teaName = options.name;
    console.log(teaName);
    this.getWindowWidth();
    this.getToday();
    var startTime = this.getDay(-90);
    this.setData({
      startTime: startTime,
      name: teaName
    })
    this.initChart();
  },
  getToday: function(e) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    var today = year + '-' + month + '-' + day;
    this.setData({
      endTime: today,
      today: today
    })
  },
  getDay: function(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码

    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
  },
  doHandleMonth: function(month) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  },
  /***搜索输入 */
  showInput: function() {
    // console.log("onChangeShowState");
    this.setData({
      inputShowed: true
    });
  },
  inputTyping: function(e) {
    // console.log("inputTyping");
    var queryString = e.detail.value;
    this.setData({
      str: queryString,
    });
    if (queryString != '') {
      this.setData({
        search: true,
      })
    }
  },
  hideInput: function() {
    // console.log("hideInput");
    this.setData({
      inputVal: "",
      inputShowed: false,
      search: false,
    });
  },

  onclassiTap: function(e) {
    var that = this;
    var time = e.currentTarget.dataset.id;
    var startTime = '';
    var endTime = '';
    switch (time) {
      case '0':
        endTime = that.data.today;
        startTime = that.getDay(-7);
        break;
      case '1':
        endTime = that.data.today;
        startTime = that.getDay(-30);
        break;
      case '2':
        endTime = that.data.today;
        startTime = that.getDay(-90);
        break;
      case '3':
        endTime = that.data.today;
        startTime = that.getDay(-180);
        break;
      case '4':
        endTime = that.data.today;
        startTime = that.getDay(-365);
        break;
    }
    this.setData({
      time: time,
      endTime: endTime,
      startTime: startTime
    })
    this.initChart();
  },
  /******搜索输入 */
  /******图表 */
  getWindowWidth() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.data.windowWidth = res.windowWidth;
      }
    });
  },
  /**
   * 获取产品历史价格
   * 
   */
  getPriceList: function(name, startTime, endTime, callback) {
    var that = this;
    var index = '';
    var price = '';
    var date = '';
    var data = {
      name: name,
      beginAt: startTime,
      endAt: endTime
    }
    app.apiFunctions.requestUrl(
      app.api.detaiResult,
      'GET',
      true,
      true,
      data,
      function(data) {
        console.log(data);
        console.log(data.statusCode);
        if (data.statusCode == 200)

        var teaList = data.data;
        var temp = {};

        var referencePrice = data.data.referencePrice;
        index = referencePrice.indexOf('(');
        price = referencePrice.substring(0, index);

        date = referencePrice.substring(index + 1, referencePrice.length);
        date = date.replace(/[^0-9-]/ig, "");
        console.log(date);
        teaList.referencePrice = price;
        teaList.updateDate = date;
        that.processPriceData(data.data.teaPriceList);
        that.setData({
          teaList: teaList,
          showHistory: false,
          showHot: false,
        })
        callback('success');
      }
    );
  },
  processPriceData: function(data) {
    var maxi = this.getMaxPrice(data);
    var mini = this.getMinPrice(data);
    var price = '';
    var temp = {};
    var date = '';
    var teaPriceList = [];
    if(data.length>0){
      var minPrice = data[mini].price;
      if (minPrice > 10000) {
        minPrice = parseFloat(minPrice / 10000).toFixed(2) - 0.02;
      } else {
        minPrice = minPrice - 100;
      }
      this.setData({
        upWan: '0',
        minPrice: minPrice
      })
      console.log(data[maxi].price);
      if (data[maxi].price > 10000) {
        for (var idx in data) {
          date = data[idx].date;
          price = parseFloat(data[idx].price / 10000).toFixed(2);
          temp = {
            date: date,
            price: price
          }
          teaPriceList.push(temp);
        }
        this.setData({
          upWan: '1',
          teaPriceList: teaPriceList,
        })
      } else {
        this.setData({
          teaPriceList: data
        })
      }
    }
  },

  getMaxPrice: function(data) {
    var maxi = 0;
    for (var idx in data) {
      if (data[maxi] <= data[idx]) {
        maxi = idx;
        break;
      }
    }
    return maxi;
  },
  getMinPrice: function(data) {
    var mini = 0;
    for (var idx in data) {
      if (data[mini] >= data[idx]) {
        mini = idx;
        break;
      }
    }
    return mini;
  },
  inputStartTime(e) {
    this.setData({
      startTime: e.detail.value
    });
    this.initChart();
  },


  inputEndTime(e) {
    this.setData({
      endTime: e.detail.value
    });
    this.initChart();
  },
  initChart() {
    const that = this;
    this.getPriceList(this.data.name, this.data.startTime, this.data.endTime,
      function(res) {
        console.log(res);
        if (res = 'success') {
          that.drawChart();
        }
      });
  },
  touchHandler: function(e) {
    // console.log(e);
    lineChart.showToolTip(
      e, {
        background: '#ecebeb',
        format: function(item, category) {
          return category + ' ' + item.name + ':' + item.data;
        }
      }
    );
  },
  touchmove: function(e) {
    // console.log(e);
    lineChart.showToolTip(
      e, {
        background: '#ecebeb',
        format: function(item, category) {
          return category + ' ' + item.name + ':' + item.data;
        }
      }
    );
  },
  touchend: function(e) {
    // console.log(e);
    lineChart.showToolTip(
      e, {
        background: '#ecebeb',
        format: function(item, category) {
          return category + ' ' + item.name + ':' + item.data;
        }
      }
    );
  },
  drawChart() {
    let width = this.data.windowWidth - 20;
    let height = 250;
    let priceList = this.data.teaPriceList;
    let canvasId = this.data.canvasId;
    let categories = [];
    let data = [];
    let unit = '';
    let tips='元'
    priceList.forEach(item => {
      categories.push(item.date);
      data.push(item.price);
    });
    // console.log(categories);
    // console.log(data);
    if (this.data.upWan == '1') {
      unit = '价格 (万)';
      tips = '万';
    } else {
      unit = '价格 (元)';
      tips = '元';
    }
    lineChart = new wxCharts({
      type: 'line',
      canvasId: canvasId,
      categories: categories,
      animation: true,
      background: 'white',
      series: [{
        name: '价格',
        data: data,
        format: function(val, name) {
          return parseFloat(val).toFixed(2) + tips;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: unit,
        min: this.data.minPrice,
        format: function(val) {
          return val.toFixed(2);
        }
      },
      width: width,
      height: height,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'straight'
      }
    });
  },
  /*********图表 */
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    // console.log(options);
    var that = this;
    var name = '找找茶';
    var shareObj = {
      title: `${name}`,
      path: '/pages/quotation/quotation',
      imageUrl: '',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
        } else if (res.errMsg == 'shareAppMessage:fail') {
        }
      }
    };
    if (options.from == 'button') {
      shareObj.path = '/pages/quotation/quotation';
    } else {
      shareObj.path = '/pages/quotation/quotation';
    }
    return shareObj;
  }
})