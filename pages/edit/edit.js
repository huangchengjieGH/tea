// pages/edit/edit.js
let app = getApp();
const tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    down: true,
    product: '',
    teaList: [
      {
        id: '',
        type: '1',
        name: '',
        status: '1',
        count: '',
        unit: '',
        price: ''
      }
    ],
    style: [
      '找',
      '代客找',
      '出',
      '代客出'
    ],
    index: '0',
    items: [
      { name: '上线', value: '0', checked: 'true' },
      { name: '下架', value: '1' },
    ],
    chooseTea: {
    },
    shopName: '',
    phone: '',
    canvasId: 'shareCanvas',
    windowWidth: 320,
    canvasWHRate: 9 / 16,
    showCanvas: false,
    qrCode: '',
    showCan: true,
    textFindList: [
    ],
    textSoldList: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onClickTap: function (e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    var down = !this.data.down;
    var teaIndex = e.currentTarget.dataset.teaindex;
    var index = e.detail.value;
    var teaList = this.data.teaList;
    teaList[teaIndex].type = parseInt(index) + 1;
    this.setData({
      index: e.detail.value,
      down: down,
      teaList: teaList
    });
  },
  bindCancelTap: function (e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  show: function () {
    this.setData({ flag: false })

  },
  //消失
  hide: function () {
    console.log('hide');
    this.setData({ flag: true })

  },
  onModalCancelTap: function (e) {
    this.setData({
      flag: true,
      moreIndex: '',
      chooseTea: {}
    })
  },
  onModalConfirmTap: function (e) {
    var teaList = this.data.teaList;
    teaList[this.data.moreIndex] = this.data.chooseTea;
    this.setData({
      flag: true,
      teaList: teaList
    })
  },
  shopNameInput: function (e) {
    var shopName = e.detail.value;
    this.setData({
      shopName: shopName
    })
  },
  phoneInput: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  isValid() {
    return /\d{11}/.test(this.data.phone);
  },
  bodyInput: function (e) {
    var body = e.detail.value;
    console.log(body);
    this.setData({
      body: body
    })
    if (body != '') {
      this.smartInput();
    }
  },
  smartInput: function (e) {
    var that = this;
    var body = this.data.body;
    app.apiFunctions.requestUrl(
      app.api.parse,
      'POST',
      true,
      false,
      body,
      function (data) {
        console.log(data);
        that.setData({
          teaList: data.data
        })
      }
    );
  },
  addTeaTap: function (e) {
    var teas = [],
      teas = this.data.teaList;
    var temp = {
      type: '1',
      name: '',
      status: '1',
      count: '',
      unit: '',
      price: ''
    }
    teas.push(temp);
    this.setData({
      teaList: teas
    })
  },
  teaInput: function (e) {
    var teaIndex = e.currentTarget.dataset.teaindex;
    var teaName = e.detail.value;
    // console.log(teaIndex);
    // console.log(teaName);
    var teaList = this.data.teaList;
    teaList[teaIndex].name = teaName;
    this.setData({
      teaList: teaList
    })
  },
  onDeleteTap: function (e) {
    console.log(e.currentTarget.dataset.teaindex);
    var index = e.currentTarget.dataset.teaindex;
    var teaList = [];
    if (index != '0') {
      teaList = this.data.teaList;
      teaList.splice(index, 1);
      this.setData({
        teaList: teaList
      })
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onMoreTap: function (e) {
    var moreIndex = e.currentTarget.dataset.teaindex;
    var chooseTea = this.data.teaList[moreIndex];
    this.setData({
      flag: false,
      chooseTea: chooseTea,
      moreIndex: moreIndex
    })
  },
  onModalNameInput: function (e) {
    var modalName = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (modalName != '') {
      chooseTea.name = modalName;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalCountInput: function (e) {
    var count = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (count != '') {
      chooseTea.count = count;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalPriceInput: function (e) {
    var price = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (price != '') {
      chooseTea.price = price;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  publishRequire: function (e) {
    var that = this;
    var body = {
      name: this.data.shopName,
      phone: this.data.phone,
      objects: this.data.teaList
    };
    app.apiFunctions.requestUrl(
      app.api.publish,
      'POST',
      true,
      false,
      body,
      function (data) {
        console.log(data);
        if(data.status == 1){
          wx.redirectTo({
            url: '../publish/publish',
          })
        }
      }
    );
  },
  onConfirmTap: function (e) {
    var that = this;
    if (this.data.shopName != '' && that.isValid()) {
      this.publishRequire();
    } else {
      wx.showToast({
        title: '信息不全或格式不对',
      })
    }
  },
  onPreviewTap:function(e){
    this.setData({
      showCan: true
    })
    this.makeGoodsCard(1);
  },
  // onGeneratePicTap: function (e) {
  //   console.log('ee');
  //   this.setData({
  //     showCan: true
  //   })
  //   this.makeGoodsCard(1);
  // },
  getWindowWidth() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowWidth: res.windowWidth * 2 });
      }
    });
  },
  saveCanvas(canvasId) {
    const that = this;
    return new Promise(function (resolve) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId,
        success: function (res) {
          resolve();
          wx.previewImage({ urls: [res.tempFilePath] });
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              that.setData({ showCanvas: false });
            }
          });
        }
      });
    });
  },
  downloadFile(url) {
    const that = this;
    return new Promise(function (resolve) {
      wx.downloadFile({
        url,
        success: function (downRes) {
          console.log(url, downRes)
          if (downRes.statusCode === 200) {
            wx.getImageInfo({
              src: downRes.tempFilePath,
              success: function (info) {
                resolve({ info, url: downRes.tempFilePath });
              }
            });
          }
        }
      });
    });
  },


  downloadFileList(list) {
    const that = this;
    let pList = [];
    for (let i = 0; i < list.length; i++) {
      pList[i] = that.downloadFile(list[i]);
    }
    return Promise.all(pList);
  },

  drawCanvas(data) {
    const that = this;
    let canvasId = that.data.canvasId;
    let windowWidth = that.data.windowWidth;
    let canvasWHRate = that.data.canvasWHRate;
    let qrCode = that.data.qrCode;
    let textFindList = that.data.textFindList;
    let textSoldList = that.data.textSoldList;
    let textContect = that.data.contact;
    let canvasColor = 'white';
    let keywordColor = 'white';
    let textColor = 'black';
    let fontSize = 15;
    let qrCodeSize = 100;
    let padding = -10;
    let token = wx.getStorageSync('token');
    // let imgList = [`https://www.wjjcypt.cn/photo/photo.png`, `${API.generate}?token=${token}`];
    let imgList = [`http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394343847_c114c89cb8b96e86812abf89b9f7c2ba.jpg`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1528775750604_6e385e0e3a1d687726c97bbb7bb64a28.png`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394825902_94cbfaab4e7a34562c24c49b36907de7.png`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394888202_9e110b7960ee001ca47e3f67caf61ed8.png`];

    let ctx = wx.createCanvasContext(canvasId);
    that.setData({ showCanvas: true });
    wx.showLoading({ title: '生成中...' });
    that.downloadFileList(imgList).then(urlList => {
      let imgInfo = urlList[0];
      let sw = imgInfo.info.width;
      let sh = imgInfo.info.height;
      let imgHeight = windowWidth * sh / sw;
      that.setData({ canvasWHRate: sw / sh });
      //画布框
      ctx.setFillStyle(canvasColor);
      ctx.fillRect(0, 0, windowWidth, imgHeight);
      //图片
      console.log(windowWidth, imgHeight);
      ctx.drawImage(imgInfo.url, 0, 0, windowWidth, imgHeight);
      ctx.drawImage(urlList[1].url, windowWidth * 0.6, imgHeight * 0.78, qrCodeSize, qrCodeSize);
      ctx.drawImage(urlList[2].url, windowWidth * 0.2, imgHeight * 0.35, qrCodeSize * 0.4, qrCodeSize * 0.4);
      ctx.drawImage(urlList[3].url, windowWidth * 0.63, imgHeight * 0.35, qrCodeSize * 0.4, qrCodeSize * 0.4);
      let x = windowWidth * 0.02 + padding + qrCodeSize * 0.5;
      let y = imgHeight * 0.48 + padding * 0.4;
      //文字
      ctx.setFontSize(fontSize);
      ctx.setFillStyle(textColor);
      textFindList.forEach(item => {
        ctx.fillText(item, x, y);
        y += fontSize * 1.5;
      })

      let x2 = windowWidth * 0.45 + padding + qrCodeSize * 0.5;
      let y2 = imgHeight * 0.48 + padding * 0.4;
      textSoldList.forEach(item => {
        ctx.fillText(item, x2, y2);
        y2 += fontSize * 1.5;
      })

      let x3 = windowWidth * 0.06 + padding + qrCodeSize * 0.5;
      let y3 = imgHeight * 0.9 + padding * 1.4;
      textContect.forEach(item => {
        ctx.fillText(item, x3, y3);
        y3 += fontSize * 1.5;
      })

      ctx.draw(false, function () {
        //生成海报
        if (data == 1) {
          that.saveCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
        }
        //预览
        if (data == 2) {
          that.previewCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
        }

      });
    });
  },
  checkSaveImageAuthor() {
    const that = this;
    return new Promise(function (resolve) {
      wx.getSetting({
        success: function (res) {
          console.log('success')
          let authorization = res.authSetting['scope.writePhotosAlbum'];
          authorization && resolve();
          authorization === false && wx.openSetting();
          authorization === undefined && wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              resolve();
            }
          });
        },

      });
    });
  },
  makeGoodsCard(data) {
    const that = this;
    this.processPreviewData(function (res) {
      console.log(res);
      if (res = 'success') {
        that.drawCanvas(data);
      }
    });
    // that.checkSaveImageAuthor().then(() => {
    //   that.drawCanvas();
    // });
  },
  processPreviewData: function (callback) {
    var contact = [];
    var textFind = [];
    var textSold = [];
    var objects = this.data.teaList;
    contact.push(this.data.shopName);
    contact.push(this.data.phone);
    for (var idx in objects) {
      if (objects[idx].type == 1 || objects[idx].type == 2) {
        textFind.push(objects[idx].name)
      }
      if (objects[idx].type == 3 || objects[idx].type == 4) {
        textSold.push(objects[idx].name);
      }
    }
    this.setData({
      contact: contact,
      textFindList: textFind,
      textSoldList: textSold
    })
    callback("success");
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
    this.setData({
      showCan: false
    })
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