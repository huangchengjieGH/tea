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
    smartinput: false,
    requireId: '',
    openUserInfo:false,
    openPhoneInfo:false,
    UserInfoStatus:false,
    UserPhoneStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var requireId = options.requireId;
    console.log('aaa', requireId);
    if (requireId) {
      this.setData({
        requireId: requireId,
        openUserInfo:true,
        UserInfoStatus:false,
        openPhoneInfo:true,
        UserPhoneStatus: false
      })
      this.getPublish(requireId);
    }
    this.getWindowWidth();
  },
  onGetUserInfoTap: function (e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      console.log('queding');
      this.getUserInfo(e.detail.userInfo);
      this.setData({
        shopName: e.detail.userInfo.nickName,
        openUserInfo:true,
        UserInfoStatus:false
      })
    }else{
      this.setData({
        openUserInfo: true,
        UserInfoStatus:true
      })
    }
  },
  onPhoneNumberTap: function (e) {
    console.log(e);
    var that = this;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    var url = `${app.api.userPhone}`;
    var that = this;
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    wx.login({
      async: false,
      success: function (res) {
        if (res.code) {
          /*获取商品信息 */
          var data = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: res.code
          }
          app.apiFunctions.requestUrl(
            url,
            'POST',
            true,
            true,
            data,
            function (data) {
              if (data.status == 1) {
                console.log(data);
                if (data.data != null){
                  that.setData({
                    phone: data.data.phoneNumber,
                    openPhoneInfo: true,
                    UserPhoneStatus:false
                  })
                }else{
                  console.log('取消');
                  that.setData({
                    openPhoneInfo: true,
                    UserPhoneStatus:true
                  })
                }              
              }
            }
          );
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
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
  // getUserPhone: function (data) {

  // },
  getPublish: function (requireId) {
    var url = `${app.api.getPublish}` + '/' + `${requireId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      url,
      'GET',
      true,
      true,
      '',
      function (data) {
        if (data.status == 1) {
          that.setData({
            shopName: data.data.name,
            phone: data.data.phone
          })
        }
      }
    );
  },
  onClickTap: function (e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  bindPickerChange: function (e) {
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
    this.setData({
      body: body
    })
    if (body != '') {
      // this.smartInput();
      this.setData({
        smartinput: true
      })
    }
  },
  onSmartInputDoneTap: function (e) {
    this.smartInput();
  },
  onClearupTap: function (e) {
    this.setData({
      body: '',
      smartinput: false
    })
  },
  smartInput: function (e) {
    var that = this;
    var body = this.data.body;
    var phone = '';
    app.apiFunctions.requestUrl(
      app.api.parse,
      'POST',
      true,
      false,
      body,
      function (data) {
        console.log(data);
        if (data.data.phone != '' && data.data.phone != null) {
          phone = data.data.phone;
        } else {
          phone = that.data.phone;
        }
        that.setData({
          teaList: data.data.objects,
          phone: phone,
          smartinput: false
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
    var teaList = this.data.teaList;
    teaList[teaIndex].name = teaName;
    this.setData({
      teaList: teaList
    })
  },
  onDeleteTap: function (e) {
    var index = e.currentTarget.dataset.teaindex;
    var teaList = [];
    var length = this.data.teaList.length;
    if (length > '1') {
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
  onModalUnitInput: function (e) {
    var unit = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (unit != '') {
      chooseTea.unit = unit;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  publishRequire: function (e) {
    var that = this;
    var requestStyle = 'POST';
    var body = {
      name: this.data.shopName,
      phone: this.data.phone,
      objects: this.data.teaList
    };
    var url = `${app.api.publish}`;
    console.log(this.data.requireId);
    if (this.data.requireId != '' && this.data.requireId != null) {
      requestStyle = 'PUT',
        url = `${app.api.publish}` + `/${this.data.requireId}`;
    }
    app.apiFunctions.requestUrl(
      url,
      requestStyle,
      true,
      false,
      body,
      function (data) {
        if (data.status == 1) {
          wx.switchTab({
            url: '../publish/publish',
          })
          wx.hideLoading();
        }
      }
    );
  },
  onConfirmTap: function (e) {
    console.log('onConfirmTap');
    var that = this;
    var length = this.data.teaList.length;
    console.log(length);
    console.log(this.data.teaList.name);
    if (length == 1 && !this.data.teaList[0].name) {
      wx.showToast({
        title: '请输入产品',
      })
    } else if (this.data.shopName != '' && that.isValid()) {
      if (this.data.requireId != '' || this.data.requireId != null) {
        var requireId = this.data.requireId;
      }
      wx.showLoading({
        title: '加载中',
      })
      this.publishRequire();
    } else {
      wx.showToast({
        title: '信息不全或格式不对',
      })
    }
  },
  onPreviewTap: function (e) {
    this.setData({
      showCan: true
    })
    this.makeGoodsCard(1);
  },
  getWindowWidth() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth * 2,
          windowHeight: res.windowHeight * 2
        });
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
    let windowHeight = that.data.windowHeight;
    let canvasWHRate = that.data.canvasWHRate;
    let qrCode = that.data.qrCode;
    let textFindList = that.data.textFindList;
    let textSoldList = that.data.textSoldList;
    let textContect = that.data.contact;
    let canvasColor = '#fefcf7';
    let keywordColor = 'white';
    let textColor = 'black';
    let fontSize = 55;
    let qrCodeSize = 100;
    let token = wx.getStorageSync('token');
    let pTextX = 0.0;
    let pTextY = 0.0;
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    // SoldLength=0;
    // findLength=0;
    let canvasHeight = (findLength + SoldLength) * 100 + 400;
    if (canvasHeight >= 1150) {
      canvasHeight = 1150;
    }
    this.setData({
      canvasHeight: canvasHeight
    })
    if (findLength > 0 && SoldLength > 0) {
      pTextX = 0.32;
      pTextY = 0.2;
    } else if (findLength == 0 && SoldLength == 0) {

    } else {
      pTextX = 0.32;
      pTextY = 0.2;
    }
    let imgList = [`https://zhaocha.yf-gz.cn/oss/file/1529394343847_c114c89cb8b96e86812abf89b9f7c2ba.jpg`, `https://zhaocha.yf-gz.cn/oss/file/1529760540068_964ac564fd6027e18ca4caa1f1768b67.png`, `https://zhaocha.yf-gz.cn/oss/file/1529760562033_4d073e86592b3b66cdfdc966dabcbb65.png`, `https://zhaocha.yf-gz.cn/oss/file/1529822340278_9c1385517cbc8860981a2e72e3ad310f.png`, `https://zhaocha.yf-gz.cn/oss/file/1529394825902_94cbfaab4e7a34562c24c49b36907de7.png`, `https://zhaocha.yf-gz.cn/oss/file/1529394888202_9e110b7960ee001ca47e3f67caf61ed8.png`,
      `https://zhaocha.yf-gz.cn/wxqrcode/img/d4390963ba134ec3adffe8610dcdba9f.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529825482542_43cecb63f716dd6b9dd7390b20dabb3.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529825635940_7a8b4ce5c1abaedd5af521eb4006e616.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828023628_4061fc6131b97ed4cdfcd0a53ea6d579.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828109391_78412cb505dba7f0981003b51ac9b541.png`];
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
      ctx.fillRect(0, 0, windowWidth, canvasHeight);
      //图片
      console.log(windowWidth, windowHeight);
      ctx.drawImage(urlList[1].url, 20, 20, 50, 50);
      ctx.drawImage(urlList[2].url, windowWidth - 70, 20, 50, 50);

      ctx.drawImage(urlList[7].url, 20, canvasHeight - 70, 50, 50);
      ctx.drawImage(urlList[8].url, windowWidth - 70, canvasHeight - 70, 50, 50);
      ctx.beginPath();
      ctx.moveTo(71, 22);
      ctx.lineTo(windowWidth - 72, 22);

      ctx.moveTo(22, 75);
      ctx.lineTo(22, canvasHeight - 72);

      ctx.moveTo(windowWidth - 20, 75);
      ctx.lineTo(windowWidth - 20, canvasHeight - 72);

      ctx.moveTo(71, canvasHeight - 20);
      ctx.lineTo(windowWidth - 72, canvasHeight - 20);

      ctx.setLineWidth(4);
      ctx.setStrokeStyle('#c4b696');
      ctx.stroke();

      //山坡
      ctx.drawImage(urlList[3].url, 0, 0, windowWidth, imgHeight);

      //二维码
      ctx.drawImage(urlList[6].url, windowWidth - 240, canvasHeight - 240, qrCodeSize * 1.8, qrCodeSize * 1.8);


      let x = windowWidth * pTextX;
      let y = windowWidth * pTextY;

      if (findLength > 0) {
        ctx.drawImage(urlList[4].url, 85, 85, qrCodeSize * 1.3, qrCodeSize * 1.3);  //找
        //文字
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textFindList.forEach(item => {
          ctx.fillText(item, x, y);
          y += fontSize * 1.3;
        })
      }
      var y2 = y;
      var y3 = y;
      if (SoldLength > 0) {
        if (findLength == 0) {
          y2 = 85;
        } else {
          y2 = y;
          y3 = y3 + 60;
        }
        ctx.drawImage(urlList[5].url, 85, y2, qrCodeSize * 1.3, qrCodeSize * 1.3);
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textSoldList.forEach(item => {
          ctx.fillText(item, x, y3);
          y3 += fontSize * 1.3;
        })
      }


      ctx.drawImage(urlList[9].url, 110, canvasHeight - 200, qrCodeSize * 0.4, qrCodeSize * 0.4);
      ctx.drawImage(urlList[10].url, 110, canvasHeight - 130, qrCodeSize * 0.4, qrCodeSize * 0.4);
      let x4 = 190;
      let y4 = canvasHeight - 165;
      ctx.setFontSize(fontSize - 15);
      textContect.forEach(item => {
        ctx.fillText(item, x4, y4);
        y4 += fontSize * 1.2;
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
  deletePublish: function (requireId) {
    var url = `${app.api.deletePublish}` + '/' + `${requireId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      url,
      'delete',
      true,
      true,
      '',
      function (data) {
        if (data.status == 1) {
          // wx.navigateTo({
          //   url: '../edit/edit',
          // })
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